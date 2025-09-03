import React, { useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a MoneyMetrics!",
      subtitle: "La app que te ayuda a organizar tus gastos y llegar a tus metas",
      content: (
        <div className="w-full">
          {/* Optimized hero section */}
          <div className="text-center space-y-3 max-w-6xl mx-auto px-2">
            {/* Compact hero icon */}
            <div className="relative flex justify-center mb-2">
              <div className="relative">
                <div className="text-4xl md:text-5xl animate-pulse filter drop-shadow-lg">🎯</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl scale-150 animate-pulse"></div>
              </div>
            </div>

            {/* Optimized hero text */}
            <div className="mb-3">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Organizá tus{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    gastos y metas
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-30 rounded-full"></div>
                </span>{' '}
                de forma simple. Anotá lo que gastás y mirá cuánto te falta para llegar.
              </p>
            </div>

            {/* Optimized features section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 rounded-2xl blur-sm"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/40 shadow-xl">
                <h3 className="font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-3 text-sm md:text-base flex items-center justify-center gap-2">
                  <span className="text-base md:text-lg">✨</span>
                  ¿Para qué te sirve?
                </h3>
                
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { icon: '📊', title: 'Mirás tu progreso', desc: 'Sabés cuánto te falta', color: 'from-green-400 to-emerald-500' },
                    { icon: '🎯', title: 'Varias metas juntas', desc: 'Podés tener las que quieras', color: 'from-purple-400 to-violet-500' },
                    { icon: '📈', title: 'Anotás fácil', desc: 'Gastás algo, lo anotás', color: 'from-blue-400 to-cyan-500' },
                    { icon: '🎉', title: 'Te motivás', desc: 'Ves que estás llegando', color: 'from-yellow-400 to-orange-500' }
                  ].map((feature, index) => (
                    <div key={index} className="group relative">
                      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[100px] md:min-h-[110px] flex flex-col">
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
                          <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                            <span className="text-white text-base md:text-lg">{feature.icon}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-xs md:text-sm mb-1 leading-tight">{feature.title}</h4>
                          <p className="text-xs text-gray-600 leading-tight">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Creá tus Metas",
      subtitle: "Poné qué querés conseguir y cuánta plata necesitás",
      content: (
        <div className="space-y-4">
          <div className="relative flex justify-center mb-3">
            <div className="relative">
              <div className="text-5xl filter drop-shadow-lg animate-bounce">📝</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border border-yellow-400/40 rounded-full animate-ping"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl scale-150 animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 rounded-2xl blur-sm"></div>
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-2xl">
              <div className="text-center mb-4">
                <h3 className="text-base font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <span className="text-lg">🚀</span>
                  Es súper fácil, solo 3 cosas:
                </h3>
              </div>
              
              <div className="relative">
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 opacity-30"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      step: 1,
                      title: 'Poné un nombre',
                      example: '"Vacaciones en Brasil 🇧🇷"',
                      tip: 'Algo que te motive',
                      color: 'from-blue-500 to-cyan-500',
                      bgColor: 'from-blue-50 to-cyan-50',
                      borderColor: 'border-blue-300'
                    },
                    {
                      step: 2,
                      title: 'Cuánta plata necesitás',
                      example: 'Ej: $150.000',
                      tip: 'Calculá más o menos',
                      color: 'from-green-500 to-emerald-500',
                      bgColor: 'from-green-50 to-emerald-50',
                      borderColor: 'border-green-300'
                    },
                    {
                      step: 3,
                      title: 'Para cuándo',
                      example: `Diciembre ${new Date().getFullYear()}`,
                      tip: 'Te ayuda a organizarte',
                      color: 'from-purple-500 to-violet-500',
                      bgColor: 'from-purple-50 to-violet-50',
                      borderColor: 'border-purple-300'
                    }
                  ].map((item, index) => (
                    <div key={index} className="group relative">
                      <div className={`relative bg-gradient-to-br ${item.bgColor} rounded-xl p-4 border-2 ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}>
                        <div className="flex justify-center mb-3">
                          <div className={`relative w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                            <span className="text-white font-bold text-lg">{item.step}</span>
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10`}></div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-600 italic">"{item.example}"</p>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs">💡</span>
                            <p className="text-xs text-gray-500 font-medium">{item.tip}</p>
                          </div>
                        </div>
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 shadow-sm">
              <span className="text-base animate-pulse">✨</span>
              <span className="text-gray-700 font-medium text-sm">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">¡Podés tener varias!</span> 
                {' '}Una para vacaciones, otra para la moto, etc.
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Anotá tus Gastos",
      subtitle: "Llevá un control de lo que gastás y lo que te falta",
      content: (
        <div className="w-full">
          <div className="text-center space-y-2 max-w-6xl mx-auto px-2">
            {/* Standardized hero icon */}
            <div className="relative flex justify-center mb-1">
              <div className="relative">
                <div className="text-4xl md:text-5xl filter drop-shadow-lg animate-pulse">💸</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-green-400/40 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl scale-150 animate-pulse"></div>
              </div>
            </div>

            {/* Compact hero text */}
            <div className="mb-2">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Es simple: cada vez que{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                    gastás plata
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-30 rounded-full"></div>
                </span>{' '}
                lo anotás acá y la app te dice cuánto te falta.
              </p>
            </div>

            {/* Compact cards grid */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 rounded-2xl blur-sm"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/40 shadow-xl">
                <h3 className="font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-2 text-sm md:text-base flex items-center justify-center gap-2">
                  <span className="text-base md:text-lg">📊</span>
                  Así funciona:
                </h3>
                
                {/* Compact grid layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {[
                    { icon: '+', title: 'Sumás plata', desc: 'Tenés $500? Lo anotás', color: 'from-green-400 to-emerald-500' },
                    { icon: '-', title: 'Gastás algo', desc: 'Pagaste $200? Lo anotás', color: 'from-orange-400 to-red-500' },
                    { icon: '📈', title: 'Mirás cuánto te falta', desc: 'La app te dice', color: 'from-blue-400 to-cyan-500' },
                    { icon: '⚡', title: 'Se guarda solo', desc: 'No perdés nada', color: 'from-purple-400 to-violet-500' }
                  ].map((feature, index) => (
                    <div key={index} className="group relative">
                      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-3 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[80px] md:min-h-[90px] flex flex-col">
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                            <span className="text-white text-sm md:text-base font-bold">{feature.icon}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-xs leading-tight mb-1">{feature.title}</h4>
                          <p className="text-xs text-gray-600 leading-tight">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "¡Ya está, empezá a usarla!",
      subtitle: "Es así de simple, solo empezá con tu primera meta",
      content: (
        <div className="text-center space-y-4">
          <div className="relative flex justify-center mb-3">
            <div className="relative">
              <div className="text-5xl animate-pulse">🎉</div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-20 rounded-full blur-xl scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 opacity-10 rounded-full blur-lg scale-200 animate-spin-slow"></div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-4 border border-green-200 shadow-xl">
              <h3 className="font-bold text-green-800 mb-3 text-base flex items-center justify-center gap-2">
                <span className="text-lg">🏆</span>
                Tips para que te funcione:
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
                <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-blue-600 text-xs">🎯</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-xs">Poné metas reales</h4>
                    <p className="text-xs text-gray-600">Que puedas cumplir</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-green-600 text-xs">📅</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-xs">Anotá seguido</h4>
                    <p className="text-xs text-gray-600">Cada tanto</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-purple-600 text-xs">🎊</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-xs">Celebrá</h4>
                    <p className="text-xs text-gray-600">Cuando llegues</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-yellow-600 text-xs">📊</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 text-xs">Mirá tu progreso</h4>
                    <p className="text-xs text-gray-600">Te va a motivar</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white shadow-xl">
              <h3 className="text-base font-bold mb-2">
                💪 ¡Es súper simple!
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Querés algo → Anotás cuánto te falta → Vas gastando → La app te dice cuánto más necesitás.
                <span className="font-bold text-white"> ¡Así de fácil!</span>
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-base text-gray-700 font-bold mb-1">
              🎯 ¡Arrancá con tu primera meta!
            </p>
            <p className="text-gray-500 text-xs">
              Es la mejor forma de empezar a organizarte
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Advanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-56 h-56 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25 blur-2xl animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        
        <div className="absolute top-40 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-cyan-300 rounded-full opacity-80 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '2.5s'}}></div>
      </div>

      {/* Main content - Glassmorphism design */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl border border-white/30 flex flex-col" style={{height: 'min(95vh, 900px)'}}>
        {/* Header with glass effect */}
        <div className="relative bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm rounded-t-3xl border-b border-white/20 p-4 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-t-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125 shadow-lg shadow-blue-500/30'
                          : index < currentStep
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-md shadow-green-400/30'
                          : 'bg-gray-300/70'
                      }`}
                    />
                    {index === currentStep && (
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-30"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={skipTour}
                className="group relative px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-all duration-300 rounded-lg hover:bg-white/50 backdrop-blur-sm"
              >
                <span className="relative z-10">Saltar tour</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </div>
            
            <div className="min-h-[60px]">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-1 leading-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {steps[currentStep].subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content area with enhanced styling */}
        <div className="flex-1 p-4 lg:p-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
          
          <div className="relative z-10 h-full">
            <div className="h-full overflow-y-auto">
              <div className="transform transition-all duration-700 ease-out animate-fadeIn min-h-full flex items-center justify-center py-4">
                {steps[currentStep].content}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced footer with glassmorphism */}
        <div className="relative bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm rounded-b-3xl border-t border-white/20 p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/80 via-blue-50/40 to-purple-50/40 rounded-b-3xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`group relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transform hover:scale-105'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>←</span>
                <span>Anterior</span>
              </span>
              {currentStep > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              )}
            </button>

            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-xs text-gray-600 font-bold shadow-sm border border-white/40">
              {currentStep + 1} de {steps.length}
            </div>

            <button
              onClick={nextStep}
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-7 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10 flex items-center space-x-2">
                <span>{currentStep === steps.length - 1 ? '¡Empezar!' : 'Siguiente'}</span>
                {currentStep === steps.length - 1 ? (
                  <span className="text-base animate-bounce">🚀</span>
                ) : (
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
