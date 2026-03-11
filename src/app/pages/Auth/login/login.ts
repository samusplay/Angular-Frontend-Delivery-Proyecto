import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  // Instanciamos formulario
  form: FormGroup;
  // Estado 
  isLoading = false;
  // Variable para guardar la url de retorno
  returnUrl: string = '/dashboard';

  // inyectar dependencias
  constructor(
    private readonly fb: FormBuilder,
    private readonly loginservice: LoginService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    // objeto de formulario
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // capturamos la ruta de retorno si viene por query params (opcional)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // envio de datos
  onSubmit(): void {
    if (this.form.invalid) {
      // mostramos errores en el HTML
      this.form.markAllAsTouched();
      
      // ⚠️ ERROR DE VALIDACIÓN
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, ingresa un usuario y contraseña válidos.', // Ajustado de correo a usuario
        confirmButtonColor: '#2563eb' // Tu azul corporativo
      });
      return;
    }
    
    // cambia el estado
    this.isLoading = true;

    // modal de carga con toast
    const toastId = toast.loading('Verificando credenciales...', {
      description: 'Por favor espera un momento'
    });

    // llamamos al servicio
    this.loginservice.login(this.form.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        toast.dismiss(toastId); // Importante: cerramos el toast flotante de carga
        this.form.reset();
        //guardamos el token
        localStorage.setItem('token', response.token);

        // exito
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido a DeliverySoftware!',
          text: 'Has iniciado sesión correctamente.', 
          timer: 1500, // Se cierra solo en 1.5 segundos
          showConfirmButton: false
        }).then(() => {
          // Redirigimos AUTOMÁTICAMENTE cuando se cierra la alerta
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        toast.dismiss(toastId); // Importante: cerramos el toast flotante de carga
        
        // ⚠️ MANEJO DEL CÓDIGO 403 (CUENTA NO VERIFICADA)
        if (err.status === 403) {
          Swal.fire({
            icon: 'info',
            title: 'Verifica tu cuenta',
            text: 'Tu cuenta aún no está activada. Por favor, ingresa el código que enviamos a tu correo.',
            confirmButtonColor: '#2563eb'
          }).then(() => {
            // Redirigimos a la pantalla de verificación
            // Opcional: podrías pasar el username en la ruta para autocompletarlo allá
            this.router.navigate(['/auth/verify']);
          });
          return; // Salimos de la función para no mostrar el error genérico abajo
        }

        // MANEJO DE OTROS ERRORES
        let message = 'Error al iniciar sesión';

        if (err.status === 401) {
          message = 'Usuario o contraseña incorrectos';
        } else if (err.status === 0) {
          message = 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
        } else if (err.error?.message) {
          message = err.error.message;
        }

        // ❌ ERROR DEL SERVIDOR
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: message,
          confirmButtonColor: '#d33'
        });
        
        // debugeo
        console.error('Error en Login:', err);
      }
    });
  }

  // helper si es necesario ya que usamos tailwind
  get f() {
    return this.form.controls;
  }


}
