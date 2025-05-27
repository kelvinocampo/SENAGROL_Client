import { IAContext } from '@/contexts/IA';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

export const HistoryIA = () => {
  const { history }: any = useContext(IAContext);

  const renderMarkdownWithLinks = (message: string) => {
    // Procesamos saltos de línea primero
    const paragraphs = message.split('\n').map((paragraph, pIndex) => {
      
      // Procesamos negritas y rutas en cada párrafo
      const elements = [];
      let remainingText = paragraph;
      
      // Expresión regular combinada para negritas y rutas
      const combinedRegex = /(\*\*.*?\*\*|__.*?__|\/[a-zA-Z0-9-_\/]+)/g;
      let match;
      let lastIndex = 0;
      
      while ((match = combinedRegex.exec(remainingText)) !== null) {
        // Texto normal antes del match
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${pIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </span>
          );
        }
        
        // Procesamos el match
        const content = match[0];
        
        // Negritas (** o __)
        if (content.startsWith('**') || content.startsWith('__')) {
          const boldText = content.substring(2, content.length - 2);
          elements.push(
            <strong key={`bold-${pIndex}-${match.index}`}>
              {boldText}
            </strong>
          );
        } 
        // Rutas (/algo)
        else if (content.startsWith('/')) {
          elements.push(
            <NavLink
              key={`link-${pIndex}-${match.index}`}
              to={content}
              className={({ isActive }) =>
                isActive
                  ? "px-2 py-1 rounded bg-blue-600 text-white"
                  : "px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              }
            >
              {content}
            </NavLink>
          );
        }
        
        lastIndex = match.index + content.length;
      }
      
      // Texto restante después del último match
      if (lastIndex < remainingText.length) {
        elements.push(
          <span key={`text-end-${pIndex}`}>
            {remainingText.substring(lastIndex)}
          </span>
        );
      }
      
      return (
        <p key={`p-${pIndex}`} className="">
          {elements}
        </p>
      );
    });
    
    return paragraphs;
  };

return (
  <div className="w-full flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md max-h-[500px] overflow-y-auto">
    {history.map((item: any, index: number) => (
      <div key={index}>
        {item.type === 'user' ? (
          <div className="flex flex-col items-end text-right">
            <p className="text-xs text-gray-500 pr-2">Usuario</p>
            <div className="bg-[#48BD28] text-white px-4 py-2 rounded-xl max-w-[80%] shadow">
              {item.message}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start text-left">
            <p className="text-xs text-gray-500 pl-1">IA</p>
            <div className="bg-[#E4FBDD] text-black px-4 py-2 rounded-xl max-w-[80%] shadow whitespace-pre-wrap">
              {renderMarkdownWithLinks(item.message)}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

};