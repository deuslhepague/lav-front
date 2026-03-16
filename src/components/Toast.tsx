interface Props { message: string }

export default function Toast({ message }: Props) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                     bg-s1/95 backdrop-blur-sm border border-border
                     text-white text-sm font-medium px-5 py-2.5 rounded-full
                     shadow-xl whitespace-nowrap pointer-events-none
                     transition-all duration-300 ${
                       message
                         ? 'opacity-100 translate-y-0'
                         : 'opacity-0 translate-y-3'
                     }`}>
      {message}
    </div>
  )
}
