import { IAContext } from '@/contexts/IA';
import { useContext } from 'react';

export const HistoryIA = () => {
  const { history }: any = useContext(IAContext);

  return (
    <div className="w-full flex flex-col gap-4">
      {history.map((item: any, index: number) => (
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
                {item.message}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
