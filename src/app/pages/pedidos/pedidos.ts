import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginService } from '../Auth/login/services/login.service';
import { CreateOrderRequestDto } from './models/create.order.request.dto';
import { PedidoService } from './services/pedido.service';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
})
export class PedidosComponent implements OnInit{
  //inyeccion de dependencias
  private pedidoService = inject(PedidoService)
  private authService = inject(LoginService)
  //servicio de catalogo
  //private catalogo
  //formulario
  private fb = inject(FormBuilder)
  private queryClient = inject(QueryClient)

  //estado del componente
  userId = signal<number>(0);
  showForm = signal<boolean>(false);

  //formulario con array
  orderForm: FormGroup = this.fb.group({
    items: this.fb.array([this.createItemFormGroup()])
  });

  //controles formulario
  createItemFormGroup(): FormGroup {
    return this.fb.group({
      productId: ['', [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }
  //accade al html
  get itemsFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  //agregar producto extra
  addItem() {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  //eliminar producto
  removeItem(index: number) {
    if (this.itemsFormArray.length > 1) {
      this.itemsFormArray.removeAt(index);
    }
  }

  

  //obtener datos del Usuario
  ngOnInit() {
    //obtenemos el token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        //descodifica
        const decodedPayload = JSON.parse(atob(payloadBase64));
        //extraemos el id
        const extractedId = decodedPayload.userId || decodedPayload.id;

        if (extractedId) {
          this.userId.set(Number(extractedId));
        }
      } catch (error) {
        //debugeo atrapamos el error
        console.error('Error al decodificar el token JWT', error);
      }
    } else {
      console.warn('No se encontró un token válido. El usuario no está logueado.');
    }
  }

  //consulta al catalogo para el select
  productsQuery = injectQuery(() => ({
    queryKey: ['products'], //llave del cache
    // queryFn: () => lastValueFrom(this.catalogoService.getAllProducts())
    //temporal
    queryFn: () => Promise.resolve([{ id: 1, name: 'Conecta tu servicio aquí', price: 0 }])
  }));

  //consulta ordenes(tabla)
  orderQuery = injectQuery(() => ({
    queryKey: ['orders', this.userId()],
    enabled: this.userId() > 0,
    queryFn: () => lastValueFrom(this.pedidoService.getOrdersByUserId(this.userId()))
  }));

  //mutaciones Post

  createMutation = injectMutation(() => ({
    mutationFn: (newOrder: CreateOrderRequestDto) =>
      lastValueFrom(this.pedidoService.createOrder(newOrder)),
    //si es exitoso
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['orders', this.userId()] });
      //reseteo de formarray
      this.orderForm.reset();
      this.itemsFormArray.clear();
      this.itemsFormArray.push(this.createItemFormGroup()); // Agregamos 1 fila limpia
      
      this.showForm.set(false);

      //excepciones Swal.fire
      Swal.fire({
        icon: 'success',
        title: 'Orden Creada',
        text: 'Tu pedido ha sido registrado con éxito.',
        confirmButtonColor: '#4f46e5'
      });
    },
    //si succede un error
    onError: (err: any) => {
      Swal.fire('Error', 'No se pudo crear la orden.', 'error')
    }
  }));

  //cancelar orden
  cancelMutation = injectMutation(() => ({
    mutationFn: (orderId: number) =>
      lastValueFrom(this.pedidoService.cancelOrder(orderId)),
    onSuccess:()=>{
      this.queryClient.invalidateQueries({queryKey:['orders',this.userId()]});
      Swal.fire('Cancelada', 'La orden ha sido cancelada.', 'success');
    },
    onError:(err:any)=>{
      Swal.fire('Error', 'No se pudo cancelar la orden.', 'error');
    }

  }));

  //metodos interfaz
  onSubmitCreate() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    this.createMutation.mutate(this.orderForm.value);
  }

  onCancelClick(orderId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6b7280',  
      confirmButtonText: 'Sí, cancelar orden',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelMutation.mutate(orderId);
      }
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
  }



}
