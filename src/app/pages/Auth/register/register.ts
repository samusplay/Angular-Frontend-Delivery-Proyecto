import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { RegisterService } from './services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxSonnerToaster],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly registerService: RegisterService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // LA MAGIA DE TANSTACK QUERY
  registerMutation = injectMutation(() => ({
    mutationFn: (userData: any) => {
      return lastValueFrom(this.registerService.register(userData));
    },
    onSuccess: (response) => {
      // 1. ¡ATRAPAMOS EL EMAIL ANTES DE BORRAR NADA!
      const userEmail = this.form.get('email')?.value;

      // 2. Ahora sí reseteamos el formulario
      this.form.reset();

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: response.message, 
        confirmButtonColor: '#2563eb'
      }).then(() => {
        // 3. Navegamos usando el email que guardamos a salvo
        this.router.navigate(['/auth/verify'], {
          queryParams: { email: userEmail }
        });
      });
    },
    onError: (err: any) => {
      const message = err.error?.message || 'Error al registrar el usuario';
      Swal.fire({
        icon: 'error',
        title: 'No se pudo crear la cuenta',
        text: message,
        confirmButtonColor: '#d33'
      });
    }
  }));

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, llena todos los campos correctamente.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    // Usamos el toast promesa para que coincida con la mutación de TanStack
    toast.promise(this.registerMutation.mutateAsync(this.form.value), {
      loading: 'Creando tu cuenta, por favor espera...',
      success: '¡Cuenta creada!',
      error: 'Hubo un problema al crear la cuenta'
    });
  }

  get f() {
    return this.form.controls;
  }
}
