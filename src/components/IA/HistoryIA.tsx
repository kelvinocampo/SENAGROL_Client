import { IAContext } from "@/contexts/IA";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import senagrol from "@assets/senagrol.png";
import { FaCircleUser } from "react-icons/fa6";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Bar,
  LineChart,
  BarChart,
  Legend,
  Line,
  PieChart,
  Pie,
} from "recharts";

interface ChartDataItem {
  [key: string]: string | number;
}

interface ChartConfig {
  data: ChartDataItem[];
  options?: {
    chartType?: "area" | "bar" | "line" | "pie";
    radius?: number;
    xKey?: string;
    yKeys?: string[];
    colors?: string[];
    xLabel?: string;
    yLabel?: string;
  };
}

interface HistoryItem {
  type: "user" | "ia";
  message: string;
  timestamp?: Date;
}

interface ProcessedMessage {
  chartData: ChartConfig | null;
  messageParts: React.ReactNode;
}

export const HistoryIA = () => {
  const { history, clearHistory } = useContext(IAContext) as {
    history: HistoryItem[];
    clearHistory: () => void;
  };

  const processMessage = (message: string): ProcessedMessage => {
    try {
      const chartRegex =
        /\[CHART\](?:\s*```(?:json)?\s*)?([\s\S]*?)(?:\s*```\s*)?\[\/CHART\]/i;
      const chartMatch = message.match(chartRegex);

      let chartData = null;
      let chartNotice = null;

      if (chartMatch && chartMatch[1]) {
        try {
          const jsonString = chartMatch[1]
            .trim()
            .replace(/^```json|```$/g, "")
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "")
            .replace(/^\s*\{/, "{")
            .replace(/\}\s*$/, "}");

          const parsedData = JSON.parse(jsonString);

          chartData = {
            data: parsedData.data || parsedData,
            options: parsedData.options || {
              xKey: parsedData.xKey || "vendedor",
              yKeys:
                parsedData.yKeys ||
                Object.keys(parsedData.data?.[0] || parsedData[0] || {}).filter(
                  (key) => key !== (parsedData.xKey || "vendedor")
                ),
              colors: parsedData.colors || ["#8884d8"],
              xLabel: parsedData.xLabel || "Vendedores",
              yLabel: parsedData.yLabel || "Cantidad",
            },
          };

          chartNotice = (
            <p key="chart-notice" className="text-sm text-gray-500 italic my-2">
              📊 Gráfica adjunta
            </p>
          );
        } catch (e) {
          console.error("Error parsing chart data:", e);
          return {
            chartData: null,
            messageParts: (
              <div className="text-red-500">
                <p>Error al procesar los datos del gráfico</p>
                <pre className="text-xs mt-2 p-2 bg-gray-100 rounded">
                  {message.match(/\[CHART\][\s\S]*?\[\/CHART\]/)?.[0] ||
                    "No se encontraron datos del gráfico"}
                </pre>
              </div>
            ),
          };
        }
      }

      const cleanedMessage = message
        .replace(chartRegex, "**Grafica Adjunta**")
        .trim();
      const messageParts = renderMarkdownWithLinks(cleanedMessage);

      return {
        chartData,
        messageParts: (
          <>
            {chartNotice}
            {messageParts}
          </>
        ),
      };
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        chartData: null,
        messageParts: <p className="text-red-500">{message}</p>,
      };
    }
  };

  const renderMarkdownWithLinks = (message: string): React.ReactNode => {
    if (!message) return null;

    return message.split("\n").map((paragraph, pIndex) => {
      if (!paragraph.trim()) return <br key={`br-${pIndex}`} />;

      if (paragraph.match(/^- \*\*.+\*\* - _.+_ - \$[\d.]+ - /)) {
        return renderProductItem(paragraph, pIndex);
      }

      const elements: React.ReactNode[] = [];
      let remainingText = paragraph;

      const mdRegex =
        /(\*\*(\S(?:.*?\S)?)\*\*|__(\S(?:.*?\S)?)__|_(\S(?:.*?\S)?)_|\/([a-zA-Z0-9][a-zA-Z0-9-_\/]*)|`([^`]+)`|\[([^\]]+)\]\((\S+)\))/g;
      let match;
      let lastIndex = 0;

      while ((match = mdRegex.exec(remainingText)) !== null) {
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${pIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </span>
          );
        }

        const fullMatch = match[0];

        if (fullMatch.startsWith("**")) {
          elements.push(
            <strong
              key={`bold-${pIndex}-${match.index}`}
              className="font-bold text-gray-800"
            >
              {match[2]}
            </strong>
          );
        } else if (fullMatch.startsWith("_") && !fullMatch.startsWith("__")) {
          elements.push(
            <em
              key={`italic-${pIndex}-${match.index}`}
              className="italic text-gray-600"
            >
              {match[4]}
            </em>
          );
        } else if (fullMatch.startsWith("/") || fullMatch.startsWith("[")) {
          const route = match[5] || match[8];
          const text = match[7] || route;
          elements.push(
            <NavLink
              key={`link-${pIndex}-${match.index}`}
              to={`${route}`}
              className="px-1.5 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm inline-flex mx-1"
            >
              {text}
            </NavLink>
          );
        } else if (fullMatch.startsWith("`")) {
          elements.push(
            <code
              key={`code-${pIndex}-${match.index}`}
              className="bg-gray-100 px-1 rounded font-mono text-sm"
            >
              {match[6]}
            </code>
          );
        }

        lastIndex = match.index + fullMatch.length;
      }

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
    const parts = text.split(" - ").filter((part) => part.trim() !== "");

    return (
      <div
        key={`product-${pIndex}`}
        className="my-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex flex-wrap items-baseline">
          <h3 className="text-lg font-bold text-gray-800 mr-2">
            {parts[0].replace(/\*\*/g, "")}
          </h3>
          <span className="text-green-600 font-semibold">{parts[2]}</span>
        </div>
        <p className="text-gray-600 italic my-1">
          {parts[1].replace(/_/g, "")}
        </p>
        <div className="mt-2">
          {parts.slice(3).map((linkPart, i) => {
            const match = linkPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
              return (
                <NavLink
                  key={`product-link-${pIndex}-${i}`}
                  to={`${match[2]}`}
                  className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs inline-block"
                >
                  {match[1]}
                </NavLink>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const renderChart = (chartConfig: ChartConfig): React.ReactNode => {
    const { data, options } = chartConfig;
    const chartType = options?.chartType || "area";
    const xKey = options?.xKey || "vendedor";
    const yKeys =
      options?.yKeys || Object.keys(data[0]).filter((key) => key !== xKey);
    const colors = options?.colors || [
      "#6366f1",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ];

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 30, bottom: 40 },
    };

    const axisStyle = {
      fontSize: 12,
      fontFamily: "Inter, sans-serif",
      fill: "#6b7280",
    };

    const axisProps = {
      xAxis: {
        dataKey: xKey,
        label: {
          value: options?.xLabel || xKey,
          position: "insideBottom",
          offset: -15,
          style: axisStyle,
        },
        tick: {
          ...axisStyle,
          angle: chartType === "bar" && data.length > 5 ? -45 : 0,
        },
        height: 60,
      },
      yAxis: {
        label: {
          value: options?.yLabel || (yKeys.length === 1 ? yKeys[0] : "Valor"),
          angle: -90,
          position: "insideLeft",
          offset: 15,
          style: axisStyle,
        },
        tick: axisStyle,
        width: 80,
      },
    };

    const tooltipProps = {
      contentStyle: {
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        border: "none",
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      formatter: (value: number, name: string) => {
        if (chartType === "pie") {
          return [`${value} productos`, "Cantidad"];
        }
        return [value, options?.yLabel || name];
      },
      labelFormatter: (label: string) => (
        <strong>{`${options?.xLabel || "Categoría"}: ${label}`}</strong>
      ),
      cursor: chartType === "pie" ? false : { fill: "#f3f4f6" },
    };

    const legendProps: any = {
      wrapperStyle: {
        paddingTop: "20px",
        fontSize: "12px",
      },
      ...(chartType === "pie" && {
        layout: "vertical",
        verticalAlign: "middle",
        align: "right",
      }),
    };

    const renderChartByType = () => {
      switch (chartType) {
        case "bar":
          return (
            <BarChart {...commonProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis {...axisProps.xAxis} />
              <YAxis {...axisProps.yAxis} />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              {yKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          );
        case "line":
          return (
            <LineChart {...commonProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis {...axisProps.xAxis} />
              <YAxis {...axisProps.yAxis} />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              {yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          );
        case "pie":
          return (
            <PieChart {...commonProps}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={options?.radius ? options.radius * 60 : 50}
                outerRadius={options?.radius ? options.radius * 100 : 80}
                paddingAngle={2}
                dataKey={yKeys[0]}
                nameKey={xKey}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                animationDuration={1500}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
            </PieChart>
          );
        case "area":
        default:
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis {...axisProps.xAxis} />
              <YAxis {...axisProps.yAxis} />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              {yKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                  activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                  animationDuration={1500}
                />
              ))}
            </AreaChart>
          );
      }
    };

    return (
      <div className="h-80 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          {renderChartByType()}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Botón Vaciar historial */}
      {history.length > 0 && (
        <div className="flex justify-end px-3">
          <button
            onClick={clearHistory}
            className="bg-red-500 text-white hover:bg-red-600 text-sm px-4 py-2 rounded shadow"
          >
            Vaciar historial
          </button>
        </div>
      )}
    {!history.some((item) => item.type === "user") && (
      <div className="flex items-start text-left w-full px-3 gap-x-2 animate-fade-in">
        <img src={senagrol} alt="IA" className="h-8 mt-1" />
        <div className="bg-[#D9D9D9] text-black px-4 py-2 rounded-xl w-fit max-w-[90%] shadow-sm border border-gray-200">
          <p className="whitespace-pre-wrap">¡Hola! 👋 ¿En qué puedo ayudarte hoy?</p>
        </div>
      </div>
    )}
      {/* Render de historial */}
      {history.map((item, index) => {
        const { chartData, messageParts } = processMessage(item.message);

        return (
          <div key={index} className="animate-fade-in">
            {item.type === "user" ? (
              <div className="flex justify-end pr-3">
                <div className="flex gap-2 items-end">
                  <div className="bg-[#D9D9D9] text-black px-4 py-2 rounded-xl max-w-[75%]">
                    {item.message}
                  </div>
                  <FaCircleUser size={40} className="text-[#48BD28]" />
                </div>
              </div>
            ) : (
              <div className="flex items-start text-left w-full px-3 gap-x-2">
                <img src={senagrol} alt="IA" className="h-8 mt-1" />

                <div className="bg-[#D9D9D9] text-black px-4 py-2 rounded-xl w-fit max-w-[90%] shadow-sm border border-gray-200">
                  {chartData && (
                    <div className="mb-3">{renderChart(chartData)}</div>
                  )}
                  <div className="whitespace-pre-wrap">{messageParts}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
