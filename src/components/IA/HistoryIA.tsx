import { IAContext } from "@/contexts/IA";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import senagrol from "@assets/senagrol.png";
import { FaCircleUser } from "react-icons/fa6";

export const HistoryIA = () => {
  const { history }: any = useContext(IAContext);

  const renderMarkdownWithLinks = (message: string) => {
    return message.split("\n").map((paragraph, idx) => {
      const combinedRegex = /(\*\*.*?\*\*|__.*?__|\/[a-zA-Z0-9-_\/]+)/g;
      const parts = [];
      let last = 0;
      let m: RegExpExecArray | null;

      while ((m = combinedRegex.exec(paragraph)) !== null) {
        if (m.index > last) parts.push(<span key={last}>{paragraph.slice(last, m.index)}</span>);
        const token = m[0];
        if (token.startsWith("**") || token.startsWith("__")) {
          parts.push(<strong key={m.index}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith("/")) {
          parts.push(
            <NavLink
              key={m.index}
              to={token}
              className="px-1 rounded text-blue-600 hover:underline"
            >
              {token}
            </NavLink>
          );
        }
        last = m.index + token.length;
      }
      if (last < paragraph.length) parts.push(<span key="end">{paragraph.slice(last)}</span>);
      return (
        <p key={idx} className="whitespace-pre-wrap leading-snug">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2">
      {history.map((item: any, idx: number) => {
        const isUser = item.type === "user";
        return (
          <div
            key={idx}
            className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
          >
            {/* Avatar */}
            <div className="w-7 h-7">
              {isUser ? (
                <FaCircleUser className="w-7 h-7 text-[#1B7D00]" />
              ) : (
                <img
                  src={senagrol}
                  alt="IA"
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
            </div>

            {/* Burbuja */}
            <div
              className={`max-w-[75%] rounded-xl px-4 py-2 shadow
                ${isUser ? "bg-[#EDEDED] text-black" : "bg-[#EDEDED] text-black"}`}
            >
              {isUser ? (
                <span className="whitespace-pre-wrap">{item.message}</span>
              ) : (
                renderMarkdownWithLinks(item.message)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
