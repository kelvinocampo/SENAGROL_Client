import { IAContext } from '@/contexts/IA';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  producto: string;
  [key: string]: string | number;
}

interface ChartConfig {
  data: ChartDataItem[];
  options?: {
    xKey?: string;
    yKeys?: string[];
    colors?: string[];
    xLabel?: string;
    yLabel?: string;
  };
}

interface HistoryItem {
  type: 'user' | 'ia';
  message: string;
  timestamp?: Date;
}

interface ProcessedMessage {
  chartData: ChartConfig | null;
  messageParts: React.ReactNode;
}

export const HistoryIA = () => {
  const { history } = useContext(IAContext) as { history: HistoryItem[] };

  const processMessage = (message: string): ProcessedMessage => {
    try {
      // Extraer datos de gráfico primero
      const chartRegex = /\[CHART\](.*?)\[\/CHART\]/s;
      const chartMatch = message.match(chartRegex);
      
      let chartData = null;
      if (chartMatch && chartMatch[1]) {
        try {
          const parsedData = JSON.parse(chartMatch[1]);
          chartData = {
            data: parsedData.data || parsedData,
            options: parsedData.options || {
              xKey: 'producto',
              yKeys: Object.keys(parsedData.data?.[0] || parsedData[0] || {}).filter(key => key !== 'producto'),
              xLabel: parsedData.xLabel || 'Productos',
              yLabel: parsedData.yLabel || 'Valor'
            }
          };
        } catch (e) {
          console.error("Error parsing chart data:", e);
        }
      }
      
      // Limpiar el mensaje (remover el bloque CHART)
      const cleanedMessage = message.replace(chartRegex, '').trim();
      
      return {
        chartData,
        messageParts: renderMarkdownWithLinks(cleanedMessage)
      };
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        chartData: null,
        messageParts: <p>{message}</p>
      };
    }
  };

  const renderMarkdownWithLinks = (message: string): React.ReactNode => {
    if (!message) return null;

    return message.split('\n').map((paragraph, pIndex) => {
      if (!paragraph.trim()) return <br key={`br-${pIndex}`} />;

      // Detección de listas de productos
      if (paragraph.match(/^- \*\*.+\*\* - _.+_ - \$[\d.]+ - /)) {
        return renderProductItem(paragraph, pIndex);
      }

      const elements: React.ReactNode[] = [];
      let remainingText = paragraph;
      
      // Regex mejorado para markdown
      const mdRegex = /(\*\*(\S(?:.*?\S)?)\*\*|__(\S(?:.*?\S)?)__|_(\S(?:.*?\S)?)_|\/([a-zA-Z0-9][a-zA-Z0-9-_\/]*)|`([^`]+)`|\[([^\]]+)\]\((\S+)\))/g;
      let match;
      let lastIndex = 0;
      
      while ((match = mdRegex.exec(remainingText)) !== null) {
        // Texto normal antes del match
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${pIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </span>
          );
        }
        
        // Procesar el match
        const fullMatch = match[0];
        
        // Negritas (**text**)
        if (fullMatch.startsWith('**')) {
          const text = match[2];
          elements.push(
            <strong key={`bold-${pIndex}-${match.index}`} className="font-bold text-gray-800">
              {text}
            </strong>
          );
        }
        // Cursivas (_text_)
        else if (fullMatch.startsWith('_') && !fullMatch.startsWith('__')) {
          const text = match[4];
          elements.push(
            <em key={`italic-${pIndex}-${match.index}`} className="italic text-gray-600">
              {text}
            </em>
          );
        }
        // Links (/ruta o [text](url))
        else if (fullMatch.startsWith('/') || fullMatch.startsWith('[')) {
          const route = match[5] || match[8];
          const text = match[7] || route;
          elements.push(
            <NavLink
              key={`link-${pIndex}-${match.index}`}
              to={route}
              className="px-1.5 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm inline-flex mx-1"
              target={route}
            >
              {text}
            </NavLink>
          );
        }
        // Código (`code`)
        else if (fullMatch.startsWith('`')) {
          const code = match[6];
          elements.push(
            <code key={`code-${pIndex}-${match.index}`} className="bg-gray-100 px-1 rounded font-mono text-sm">
              {code}
            </code>
          );
        }
        
        lastIndex = match.index + fullMatch.length;
      }
      
      // Texto restante
      if (lastIndex < remainingText.length) {
        elements.push(
          <span key={`text-end-${pIndex}`}>
            {remainingText.substring(lastIndex)}
          </span>
        );
      }
      
      return (
        <p key={`p-${pIndex}`} className="my-2 text-gray-700">
          {elements}
        </p>
      );
    });
  };

  const renderProductItem = (text: string, pIndex: number): React.ReactNode => {
    // Formato: - **Nombre** - _Descripción_ - $Precio - [Ver producto](URL)
    const parts = text.split(' - ').filter(part => part.trim() !== '');
    
    return (
      <div key={`product-${pIndex}`} className="my-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-baseline">
          <h3 className="text-lg font-bold text-gray-800 mr-2">
            {parts[0].replace(/\*\*/g, '')}
          </h3>
          <span className="text-green-600 font-semibold">
            {parts[2]}
          </span>
        </div>
        <p className="text-gray-600 italic my-1">
          {parts[1].replace(/_/g, '')}
        </p>
        <div className="mt-2">
          {parts.slice(3).map((linkPart, i) => {
            if (linkPart.startsWith('[')) {
              const match = linkPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (match) {
                return (
                  <NavLink
                    key={`product-link-${pIndex}-${i}`}
                    to={match[2].startsWith('http') ? match[2] : `/${match[2]}`}
                    className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs inline-block"
                    target={match[2].startsWith('http') ? '_blank' : undefined}
                  >
                    {match[1]}
                  </NavLink>
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const renderChart = (chartConfig: ChartConfig): React.ReactNode => {
    const { data, options } = chartConfig;
    const xKey = options?.xKey || 'producto';
    const yKeys = options?.yKeys || Object.keys(data[0]).filter(key => key !== xKey);
    const colors = options?.colors || ['#8884d8', '#82ca9d', '#ffc658'];
    
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey={xKey} 
              label={{ value: options?.xLabel, position: 'insideBottomRight', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: options?.yLabel, angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            {yKeys.map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]} 
                fill={colors[index % colors.length]} 
                fillOpacity={0.4}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {history.map((item, index) => {
        const { chartData, messageParts } = processMessage(item.message);
        
        return (
          <div key={index}>
            {item.type === 'user' ? (
              <div className="flex flex-col items-end text-right">
                <p className="text-xs text-gray-500 pr-2">Usuario</p>
                <div className="bg-[#48BD28] text-white px-4 py-2 rounded-xl max-w-[70%]">
                  {item.message}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start text-left">
                <p className="text-xs text-gray-500 pl-1">IA</p>
                <div className="bg-[#E4FBDD] text-black px-4 py-2 rounded-xl max-w-[70%]">
                  {chartData && (
                    <div className="mb-3 p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">Gráfico generado:</p>
                      {renderChart(chartData)}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {messageParts}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};