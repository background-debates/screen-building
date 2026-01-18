import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Send,
  Wifi,
  Battery,
  Lock,
} from "lucide-react";

// Opinion data for the chart
const opinionData = [
  { opinion: "Ja", votes: 4, color: "#10b981" },
  { opinion: "Eher Ja", votes: 6, color: "#84cc16" },
  { opinion: "Eher Nein", votes: 7, color: "#f59e0b" },
  { opinion: "Nein", votes: 9, color: "#ef4444" },
];

// Voting options
const votingOptions = [
    { label: "Ja", color: "#10b981" },
      { label: "Eher Ja", color: "#84cc16" },
        { label: "Eher Nein", color: "#f59e0b" },



  { label: "Nein", color: "#ef4444" },
];

// Chat messages
const chatMessages = [
  {
    id: 1,
    name: "Anna Schmidt",
    time: "12:42",
    message:
      "PFAS sind extrem langlebig und reichern sich in der Umwelt an. Wir sollten sie definitiv verbieten.",
    stance: "Ja",
    isOwn: false,
  },
  {
    id: 2,
    name: "Michael Weber",
    time: "12:43",
    message:
      "Es gibt aber viele wichtige Anwendungen in der Medizin und Industrie. Ein komplettes Verbot wäre zu radikal.",
    stance: "Eher Nein",
    isOwn: false,
  },
];

// Get color based on stance
const getStanceColor = (stance: string) => {
  switch (stance) {
    case "Ja":
      return "#10b981";
    case "Eher Ja":
      return "#84cc16";
    case "Eher Nein":
      return "#f59e0b";
    case "Nein":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export default function App() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const handleVote = (option: string) => {
    setSelectedVote(option);
  };

  const submitVote = () => {
    if (selectedVote) {
      setHasVoted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* iPhone Container */}
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[50px] overflow-hidden flex flex-col relative">
        {/* Status Bar */}
        <div className="h-11 bg-white flex items-start px-6 pt-2 relative">
          <div className="text-[15px] font-semibold">13:45</div>
          <div className="absolute left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full"></div>
          <div className="flex items-center gap-1 ml-auto">
            <div className="text-[10px]">····</div>
            <Wifi className="w-4 h-4" strokeWidth={2.5} />
            <Battery className="w-6 h-3" strokeWidth={2.5} />
          </div>
        </div>

        {/* Header */}
        <div className="h-11 bg-white border-b border-gray-200 flex items-center px-4 relative">
          <button className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium whitespace-nowrap">
            PFAS Verbot
          </div>
          <button className="p-1 ml-auto">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {!hasVoted ? (
          <>
            {/* Voting Screen */}
            <div className="flex-1 overflow-y-auto bg-[#f0f0f5] px-4 py-4">
              {/* Question Card */}
              <div className="mb-6 flex justify-start">
                <div className="bg-white rounded-[18px] p-4 shadow-sm w-full">
                  <div className="text-[15px] font-medium mb-4 text-gray-800 text-center">
                    Sollte PFAS verboten werden?
                  </div>
                  
                  {/* Voting Options */}
                  <div className="flex justify-between items-end gap-3 mb-4">
                    {votingOptions.map((option) => (
                      <div
                        key={option.label}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleVote(option.label)}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                            selectedVote === option.label
                              ? "border-4"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{
                            borderColor: selectedVote === option.label ? option.color : undefined,
                            backgroundColor: selectedVote === option.label ? `${option.color}20` : "transparent",
                          }}
                        >
                          {selectedVote === option.label && (
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                          )}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-2 text-center whitespace-nowrap">
                          {option.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitVote}
                    disabled={!selectedVote}
                    className={`w-full py-2 rounded-full text-[15px] font-medium transition-all ${
                      selectedVote
                        ? "bg-[#5B9EFF] text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Abstimmen
                  </button>
                </div>
              </div>

              {/* Locked Chat Area */}
              <div className="bg-white rounded-[18px] p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-[15px] text-gray-500 leading-[22px] max-w-[240px]">
                    Erst nach dem Abstimmen kannst du den weiteren Chatverlauf einsehen.
                  </div>
                </div>
              </div>
            </div>

            {/* Disabled Input Bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-2 pb-6 opacity-50">
              <div className="flex items-center gap-2">
                <button className="p-2" disabled>
                  <Plus className="w-6 h-6 text-gray-400" />
                </button>
                <div className="flex-1 bg-[#f0f0f5] rounded-full px-4 py-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Nachricht"
                    className="flex-1 bg-transparent outline-none text-[17px]"
                    disabled
                  />
                </div>
                <button className="p-2" disabled>
                  <Send className="w-6 h-6 text-gray-300" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Messages Container - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#f0f0f5] px-4 py-4">
          {/* Opinion Chart Card */}
          <div className="mb-3 flex justify-start">
            <div className="bg-white rounded-[18px] p-3 shadow-sm w-full">
              <div className="text-xs font-medium mb-2 text-gray-600">
                Sollte PFAS verboten werden?
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={opinionData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="opinion"
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                      {opinionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-gray-400 text-right mt-1">
                12:40
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[280px]">
                {!message.isOwn && (
                  <div className="text-[11px] text-gray-500 mb-1 ml-2">
                    {message.name}
                  </div>
                )}
                <div
                  className={`rounded-[18px] px-4 py-2 ${
                    message.isOwn
                      ? "bg-[#5B9EFF] text-white rounded-tr-[4px]"
                      : "bg-white text-black rounded-tl-[4px]"
                  }`}
                  style={{
                    borderLeft: message.isOwn
                      ? "none"
                      : `4px solid ${getStanceColor(message.stance)}`,
                  }}
                >
                  <div className="text-[15px] leading-[20px]">
                    {message.message}
                  </div>
                  <div
                    className={`text-[11px] text-right mt-1 ${message.isOwn ? "opacity-80" : "text-gray-400"}`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Question Message */}
          <div className="mb-3 flex justify-center">
            <div className="bg-[#5B9EFF] text-white rounded-[18px] px-4 py-2 max-w-[280px]">
              <div className="text-[15px] leading-[20px]">
                @Anna Wenn man PFAS verbieten soll, sollte man
                auch andere ungesunde Substanzen wie Alkohol
                verbieten?
              </div>
              <div className="text-[11px] opacity-80 text-right mt-1">
                12:37
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 pb-6">
          <div className="flex items-center gap-2">
            <button className="p-2">
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 bg-[#f0f0f5] rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                placeholder="Nachricht"
                className="flex-1 bg-transparent outline-none text-[17px]"
              />
            </div>
            <button className="p-2">
              <Send
                className="w-6 h-6 text-[#5B9EFF]"
                fill="#5B9EFF"
              />
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}