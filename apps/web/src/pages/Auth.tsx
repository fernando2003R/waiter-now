import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { CountryCodeSelector, countries, type Country } from '@/components/CountryCodeSelector'
import { WaiterNowLogo } from '@/components/WaiterNowLogo'

interface LoginForm {
  email: string
  password: string
}

interface RegisterForm {
  name: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export function Auth() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]) // Colombia por defecto
  
  const { 
    register: registerLogin, 
    handleSubmit: handleSubmitLogin, 
    formState: { errors: loginErrors, isSubmitting: isSubmittingLogin },
    reset: resetLogin
  } = useForm<LoginForm>()
  
  const { 
    register: registerRegister, 
    handleSubmit: handleSubmitRegister, 
    formState: { errors: registerErrors, isSubmitting: isSubmittingRegister }, 
    watch, 
    setValue,
    reset: resetRegister
  } = useForm<RegisterForm>()
  
  const { login, register: registerUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register')
    } else {
      setActiveTab('login')
    }
  }, [location.pathname])

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

  // Reset forms when switching tabs
  useEffect(() => {
    resetLogin()
    resetRegister()
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [activeTab, resetLogin, resetRegister])

  const onSubmitLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in the login function
    }
  }

  const onSubmitRegister = async (data: RegisterForm) => {
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
        phone: contactMethod === 'phone' ? `${selectedCountry.dialCode} ${data.phone}` : undefined
      }

      await registerUser(registerData)
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch (error) {
      // Error handling is done in the register function
    }
  }

  const { signInWithGoogle, isGoogleAuthAvailable, isLoading: isGoogleLoading } = useGoogleAuth()

  const handleGoogleAuth = () => {
    console.log('handleGoogleAuth llamado')
    if (!isGoogleAuthAvailable()) {
      toast.error('Google Auth no está configurado correctamente')
      return
    }
    signInWithGoogle()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <WaiterNowLogo width={100} height={100} />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            {activeTab === 'login' ? 'Bienvenido' : 'Únete a nosotros'}
          </h2>
          <p className="text-sm text-gray-600">
            {activeTab === 'login' 
              ? 'Panel de administración para restaurantes' 
              : 'Crea tu cuenta y gestiona tu restaurante'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-body">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => {
                  setActiveTab('login')
                  navigate('/login')
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'login'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setActiveTab('register')
                  navigate('/register')
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'register'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="space-y-6" onSubmit={handleSubmitLogin(onSubmitLogin)}>
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...registerLogin('email', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electrónico inválido'
                        }
                      })}
                      type="email"
                      className={`input pl-10 ${loginErrors.email ? 'input-error' : ''}`}
                      placeholder="tu@restaurante.com"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-error-600">{loginErrors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...registerLogin('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className={`input pl-10 pr-10 ${loginErrors.password ? 'input-error' : ''}`}
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
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-error-600">{loginErrors.password.message}</p>
                  )}
                </div>

                {/* Remember me and forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Recordar sesión
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={isSubmittingLogin || isLoading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isSubmittingLogin || isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form className="space-y-6" onSubmit={handleSubmitRegister(onSubmitRegister)}>
                {/* Name */}
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...registerRegister('name', {
                        required: 'El nombre es requerido',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres'
                        }
                      })}
                      type="text"
                      className={`input pl-10 ${registerErrors.name ? 'input-error' : ''}`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="mt-1 text-sm text-error-600">{registerErrors.name.message}</p>
                  )}
                </div>

                {/* Contact method */}
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
                        {...registerRegister('email', {
                          required: contactMethod === 'email' ? 'El correo es requerido' : false,
                          pattern: contactMethod === 'email' ? {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido'
                          } : undefined
                        })}
                        type="email"
                        className={`input pl-10 ${registerErrors.email ? 'input-error' : ''}`}
                        placeholder="tu@restaurante.com"
                      />
                      {registerErrors.email && (
                        <p className="mt-1 text-sm text-error-600">{registerErrors.email.message}</p>
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
                            {...registerRegister('phone', {
                              required: contactMethod === 'phone' ? 'El teléfono es requerido' : false,
                              pattern: contactMethod === 'phone' ? {
                                value: /^[\d\s\-\(\)]{7,}$/,
                                message: 'Número de teléfono inválido'
                              } : undefined
                            })}
                            type="tel"
                            className={`input pl-10 rounded-l-none border-l-0 ${registerErrors.phone ? 'input-error' : ''}`}
                            placeholder="123 456 789"
                          />
                        </div>
                      </div>
                      {registerErrors.phone && (
                        <p className="mt-1 text-sm text-error-600">{registerErrors.phone.message}</p>
                      )}
                    </div>
                  )}
                </div>



                {/* Password */}
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...registerRegister('password', {
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
                      className={`input pl-10 pr-10 ${registerErrors.password ? 'input-error' : ''}`}
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
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-error-600">{registerErrors.password.message}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...registerRegister('confirmPassword', {
                        required: 'Confirma tu contraseña',
                        validate: value => value === password || 'Las contraseñas no coinciden'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`input pl-10 pr-10 ${registerErrors.confirmPassword ? 'input-error' : ''}`}
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
                  {registerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">{registerErrors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start">
                  <input
                    {...registerRegister('acceptTerms', {
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
                {registerErrors.acceptTerms && (
                  <p className="text-sm text-error-600">{registerErrors.acceptTerms.message}</p>
                )}

                {/* Register button */}
                <button
                  type="submit"
                  disabled={isSubmittingRegister || isLoading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isSubmittingRegister || isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    O {activeTab === 'login' ? 'continúa' : 'regístrate'} con
                  </span>
                </div>
              </div>
            </div>

            {/* Google Auth */}
            <button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading || !isGoogleAuthAvailable()}
              className={`mt-4 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium transition-colors ${
                isGoogleLoading || !isGoogleAuthAvailable()
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {isGoogleLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Cargando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}