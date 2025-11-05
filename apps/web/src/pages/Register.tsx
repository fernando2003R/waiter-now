import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { CountryCodeSelector, countries, type Country } from '@/components/CountryCodeSelector'

interface RegisterForm {
  name: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
  restaurantName: string
  acceptTerms: boolean
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Colombia por defecto
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<RegisterForm>()
  const { register: registerUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const password = watch('password')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Clear the other field when switching contact method
  useEffect(() => {
    if (contactMethod === 'email') {
      setValue('phone', undefined)
    } else {
      setValue('email', undefined)
    }
  }, [contactMethod, setValue])

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (!data.acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones')
      return
    }

    try {
      const registerData = {
        name: data.name,
        email: contactMethod === 'email' ? data.email! : `${data.phone}@phone.temp`, // Temporary email for phone users
        password: data.password,
        restaurantName: data.restaurantName,
        phone: contactMethod === 'phone' ? `${selectedCountry.dialCode} ${data.phone}` : undefined
      }

      await registerUser(registerData)
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in the register function
    }
  }

  const handleGoogleRegister = () => {
    // TODO: Implementar registro con Google
    toast.success('Redirigiendo a Google...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">WN</span>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">
            Crear cuenta en Waiter Now
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a la plataforma de gestión para restaurantes
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name', {
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres'
                      }
                    })}
                    type="text"
                    className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                )}
              </div>

              {/* Método de contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Método de contacto
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      contactMethod === 'email'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Correo electrónico
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('phone')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      contactMethod === 'phone'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Teléfono
                  </button>
                </div>

                {/* Email field */}
                {contactMethod === 'email' && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email', {
                        required: contactMethod === 'email' ? 'El correo es requerido' : false,
                        pattern: contactMethod === 'email' ? {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electrónico inválido'
                        } : undefined
                      })}
                      type="email"
                      className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                      placeholder="tu@restaurante.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                    )}
                  </div>
                )}

                {/* Phone field */}
                {contactMethod === 'phone' && (
                  <div>
                    <div className="flex">
                      <CountryCodeSelector
                        selectedCountry={selectedCountry}
                        onCountryChange={setSelectedCountry}
                        className="flex-shrink-0"
                      />
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register('phone', {
                            required: contactMethod === 'phone' ? 'El teléfono es requerido' : false,
                            pattern: contactMethod === 'phone' ? {
                              value: /^[\d\s\-\(\)]{7,}$/,
                              message: 'Número de teléfono inválido'
                            } : undefined
                          })}
                          type="tel"
                          className={`input pl-10 rounded-l-none border-l-0 ${errors.phone ? 'input-error' : ''}`}
                          placeholder="123 456 789"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Nombre del restaurante */}
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del restaurante
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('restaurantName', {
                      required: 'El nombre del restaurante es requerido',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres'
                      }
                    })}
                    type="text"
                    className={`input pl-10 ${errors.restaurantName ? 'input-error' : ''}`}
                    placeholder="Nombre de tu restaurante"
                  />
                </div>
                {errors.restaurantName && (
                  <p className="mt-1 text-sm text-error-600">{errors.restaurantName.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password', {
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 8,
                        message: 'La contraseña debe tener al menos 8 caracteres'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword', {
                      required: 'Confirma tu contraseña',
                      validate: value => value === password || 'Las contraseñas no coinciden'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start">
                <input
                  {...register('acceptTerms', {
                    required: 'Debes aceptar los términos y condiciones'
                  })}
                  id="accept-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
                  Acepto los{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    política de privacidad
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-error-600">{errors.acceptTerms.message}</p>
              )}

              {/* Botón de registro */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn btn-primary btn-lg w-full"
              >
                {isSubmitting || isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                </div>
              </div>
            </div>

            {/* Registro con Google */}
            <button
              onClick={handleGoogleRegister}
              className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}