import { motion } from 'framer-motion'
import { DollarSign, Clock, Zap } from 'lucide-react'

const ServiceCard = ({ service, isSelected, onSelect, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
          : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-750'
      }`}
      onClick={() => onSelect(service)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          isSelected ? 'bg-primary-500/20' : 'bg-slate-700'
        }`}>
          <Icon className={`w-6 h-6 ${
            isSelected ? 'text-primary-400' : 'text-slate-400'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {service.name}
          </h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">
                  {service.price} {service.currency}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">~2-5s</span>
              </div>
            </div>
            
            {isSelected && (
              <div className="flex items-center gap-1 text-primary-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Seleccionado</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Parameters */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex flex-wrap gap-2">
          {service.parameters?.map((param, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
            >
              {param}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceCard