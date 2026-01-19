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

// Scenario poll data
const realisticData = [
  { opinion: "Ja", votes: 3, color: "#10b981" },
  { opinion: "Eher Ja", votes: 8, color: "#84cc16" },
  { opinion: "Eher Nein", votes: 10, color: "#f59e0b" },
  { opinion: "Nein", votes: 5, color: "#ef4444" },
];

const likingData = [
  { opinion: "Ja", votes: 6, color: "#10b981" },
  { opinion: "Eher Ja", votes: 9, color: "#84cc16" },
  { opinion: "Eher Nein", votes: 7, color: "#f59e0b" },
  { opinion: "Nein", votes: 4, color: "#ef4444" },
];

// Voting options
const votingOptions = [
    { label: "Ja", color: "#10b981" },
      { label: "Eher Ja", color: "#84cc16" },
        { label: "Eher Nein", color: "#f59e0b" },



  { label: "Nein", color: "#ef4444" },
];

// Chat messages (initial data)
const initialChatMessages = [
  {
    id: 1,
    name: "Anna Schmidt",
    time: "12:42",
    message:
      "PFAS sind extrem langlebig und reichern sich in der Umwelt an. Wir sollten sie definitiv verbieten.",
    stance: "Ja",
    isOwn: false,
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "💡", count: 3 },
      { emoji: "🤨", count: 1 },
    ],
  },
  {
    id: 2,
    name: "Michael Weber",
    time: "12:43",
    message:
      "Es gibt aber viele wichtige Anwendungen in der Medizin und Industrie. Ein komplettes Verbot wäre zu radikal.",
    stance: "Eher Nein",
    isOwn: false,
    reactions: [
      { emoji: "👎", count: 2 },
      { emoji: "🔍", count: 4 },
    ],
  },
];


const secondaryChatMessages = [
  {
    id: 3,
    name: "Anna Schmidt",
    time: "12:44",
    message: "Das ist ein unfairer Vergleich. Alkohol trinke ich freiwillig. PFAS nehme ich ungewollt über das Trinkwasser und die Nahrung auf, dagegen kann ich mich als Einzelperson kaum wehren.",
    stance: "Ja",
    isOwn: false,
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🧠", count: 5 },
    ],
  },
  {
    id: 4,
    name: "Günter Maier",
    time: "12:45",
    message: "Das stimmt, aber von dem Einfluss von Alkohol auf die Gesundheit und die sozialen Schäden sind wir alle betroffen.",
    stance: "Eher Nein",
    isOwn: false,
    reactions: [
      { emoji: "🤨", count: 2 },
      { emoji: "👍", count: 3 },
    ],
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

// Reaction options
const reactionOptions = [
  { emoji: "👍", label: "Stimme zu" },
  { emoji: "👎", label: "Stimme nicht zu" },
  { emoji: "💡", label: "Gutes Argument" },
  { emoji: "🤨", label: "Das glaube ich nicht" },
  { emoji: "🔍", label: "Wir sollten die Fakten klären" },
  { emoji: "🧠", label: "Sollten wir vertiefen" },
  { emoji: "❓", label: "Bitte genauer erklären" },
];

// Reusable Input Bar Component
interface InputBarProps {
  disabled?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

function InputBar({ disabled = false, showBackButton = false, onBack }: InputBarProps) {
  return (
    <div className={`bg-white border-t border-gray-200 px-4 py-2 pb-6 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button className="p-2" onClick={onBack}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <button className="p-2" disabled={disabled}>
            <Plus className={`w-6 h-6 ${disabled ? "text-gray-400" : "text-gray-600"}`} />
          </button>
        )}
        <div className="flex-1 bg-[#f0f0f5] rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Nachricht"
            className="flex-1 bg-transparent outline-none text-[17px]"
            disabled={disabled}
          />
        </div>
        <button className="p-2" disabled={disabled}>
          <Send
            className={`w-6 h-6 ${disabled ? "text-gray-300" : "text-[#5B9EFF]"}`}
            fill={disabled ? undefined : "#5B9EFF"}
          />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = onboarding, 1 = voting, 2 = chat, 3 = reaction, 4 = scenario
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [scenarioVoteRealistic, setScenarioVoteRealistic] = useState<string | null>(null);
  const [scenarioVoteLike, setScenarioVoteLike] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [userReactions, setUserReactions] = useState<Record<number, string>>({}); // messageId -> emoji
  
  // Onboarding states
  const [rememberedArgument, setRememberedArgument] = useState("");
  const [openQuestion, setOpenQuestion] = useState("");

  // Get the label for currently hovered or selected reaction
  const getReactionLabel = () => {
    const emoji = hoveredReaction || selectedReaction;
    if (!emoji) return "Wähle eine Reaktion";
    const reaction = reactionOptions.find(r => r.emoji === emoji);
    return reaction?.label || "";
  };

  const handleVote = (option: string) => {
    setSelectedVote(option);
  };

  const submitVote = () => {
    if (selectedVote) {
      setCurrentScreen(2);
    }
  };

  const openReactionScreen = () => {
    setCurrentScreen(3);
  };

  const handleReactionSelect = (emoji: string) => {
    setSelectedReaction(emoji);
    
    // Update user's reaction for this message (message id 1)
    const messageId = 1;
    const previousEmoji = userReactions[messageId];
    
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        let newReactions = [...msg.reactions];
        
        // Remove previous user reaction if exists
        if (previousEmoji) {
          newReactions = newReactions.map(r => 
            r.emoji === previousEmoji ? { ...r, count: r.count - 1 } : r
          ).filter(r => r.count > 0);
        }
        
        // Add new reaction
        const existingReaction = newReactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          newReactions = newReactions.map(r =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          );
        } else {
          newReactions.push({ emoji, count: 1 });
        }
        
        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));
    
    setUserReactions(prev => ({ ...prev, [messageId]: emoji }));
    
    // Go back to chat after selecting
    setTimeout(() => {
      setCurrentScreen(2);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 gap-6">
      {/* Screen Slider Control */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-md w-full max-w-[390px]">
        <div className="text-sm font-medium text-gray-600 mb-2 text-center">
          Screen: {
            currentScreen === 0 ? "Vorgespräch" : 
            currentScreen === 1 ? "Abstimmung" : 
            currentScreen === 2 ? "Chat" : 
            currentScreen === 3 ? "Reaktionen" :
            "Zukunft"
          }
        </div>
        <input
          type="range"
          min="0"
          max="4"
          value={currentScreen}
          onChange={(e) => setCurrentScreen(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B9EFF]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
          <span>Start</span>
          <span>Vote</span>
          <span>Chat</span>
          <span>React</span>
          <span>Futur</span>
        </div>
      </div>

      {/* iPhone Container */}
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[50px] overflow-hidden flex flex-col relative shadow-xl">
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

        {currentScreen === 0 ? (
          <>
            {/* Onboarding / Pre-Discussion Screen */}
            <div className="flex-1 overflow-y-auto bg-[#f0f0f5] px-6 py-8 flex flex-col">
              <div className="bg-white rounded-[24px] p-6 shadow-sm mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <div className="text-blue-500 font-bold text-xl">1</div>
                </div>
                <h3 className="text-[17px] font-semibold text-gray-900 mb-2">Vorgespräch auswerten</h3>
                <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                  Bevor wir in den digitalen Chat starten: Was ist Ihnen aus der physischen Diskussion besonders im Gedächtnis geblieben?
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">
                      Welches Argument ist Ihnen besonders im Gedächtnis geblieben?
                    </label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[15px] outline-none focus:border-blue-400 transition-colors min-h-[100px] resize-none"
                      placeholder="Ihre Antwort..."
                      value={rememberedArgument}
                      onChange={(e) => setRememberedArgument(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">
                      Welche Frage blieb offen?
                    </label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[15px] outline-none focus:border-blue-400 transition-colors min-h-[100px] resize-none"
                      placeholder="Ihre Antwort..."
                      value={openQuestion}
                      onChange={(e) => setOpenQuestion(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => setCurrentScreen(1)}
                  disabled={!rememberedArgument || !openQuestion}
                  className={`w-full py-4 rounded-2xl text-[17px] font-semibold transition-all shadow-md ${
                    rememberedArgument && openQuestion
                      ? "bg-[#5B9EFF] text-white active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Weiter zur Abstimmung
                </button>
              </div>
            </div>
          </>
        ) : currentScreen === 1 ? (
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

            <InputBar disabled />
          </>
        ) : currentScreen === 2 ? (
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

          {/* Initial Chat Messages */}
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              onClick={index === 0 ? openReactionScreen : undefined}
              style={{ cursor: index === 0 ? "pointer" : "default" }}
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
                {/* Reactions below message */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    {message.reactions.map((reaction, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-full px-2 py-1 flex items-center gap-1"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                        <span className="text-xs text-gray-700">{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                12:43
              </div>
            </div>
          </div>

          {/* Secondary Chat Messages */}
          {secondaryChatMessages.map((message) => (
            <div
              key={message.id}
              className="mb-3 flex justify-start"
            >
              <div className="max-w-[280px]">
                <div className="text-[11px] text-gray-500 mb-1 ml-2">
                  {message.name}
                </div>
                <div
                  className="rounded-[18px] px-4 py-2 bg-white text-black rounded-tl-[4px]"
                  style={{
                    borderLeft: `4px solid ${getStanceColor(message.stance)}`,
                  }}
                >
                  <div className="text-[15px] leading-[20px]">
                    {message.message}
                  </div>
                  <div className="text-[11px] text-gray-400 text-right mt-1">
                    {message.time}
                  </div>
                </div>
                {/* Reactions below message */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    {message.reactions.map((reaction, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-full px-2 py-1 flex items-center gap-1"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                        <span className="text-xs text-gray-700">{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Summary Message */}
          <div className="mb-3 flex justify-center">
            <div className="bg-[#5B9EFF] text-white rounded-[18px] px-4 py-3 max-w-[300px]">
              <div className="text-[13px] font-medium mb-2">📊 Tageszusammenfassung</div>
              <div className="text-[14px] leading-[20px]">
                Die Diskussion zeigt unterschiedliche Meinungen zum PFAS-Verbot. Während einige Teilnehmer ein komplettes Verbot befürworten, weisen andere auf wichtige industrielle Anwendungen hin.
              </div>
              <div className="text-[14px] leading-[20px] mt-2">
                <span className="font-medium">🧠 Bemerkenswert:</span> Viele Teilnehmer haben auf Annas Antwort mit "Das sollten wir vertiefen" reagiert.
              </div>
              <div className="text-[11px] opacity-80 text-right mt-2">
                13:45
              </div>
            </div>
          </div>
        </div>

        <InputBar />
          </>
        ) : currentScreen === 3 ? (
          <>
            {/* Reaction Screen */}
            <div className="flex-1 overflow-y-auto bg-[#f0f0f5] px-4 py-4 flex flex-col">
              {/* Spacer to push content down */}
              <div className="flex-1" />
              
              {/* Message with Reaction Picker */}
              <div className="mb-3 flex justify-start">
                <div className="max-w-[320px]">
                  {/* Reaction Picker Bubble */}
                  <div className="bg-white rounded-full px-3 py-2 mb-2 flex items-center gap-1 shadow-lg border border-gray-200">
                    {reactionOptions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        className={`text-2xl p-1 rounded-full transition-all duration-150 hover:scale-125 ${
                          selectedReaction === reaction.emoji ? "bg-gray-100 scale-110" : ""
                        }`}
                        onClick={() => handleReactionSelect(reaction.emoji)}
                        onMouseEnter={() => setHoveredReaction(reaction.emoji)}
                        onMouseLeave={() => setHoveredReaction(null)}
                      >
                        {reaction.emoji}
                      </button>
                    ))}
                  </div>
                  
                  {/* Always visible Reaction Label */}
                  <div className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-lg mb-3 text-center shadow-sm border border-gray-200">
                    {getReactionLabel()}
                  </div>
                  
                  {/* The Message */}
                  <div className="text-[11px] text-gray-500 mb-1 ml-2">
                    {chatMessages[0].name}
                  </div>
                  <div
                    className="rounded-[18px] px-4 py-2 bg-white text-black rounded-tl-[4px]"
                    style={{
                      borderLeft: `4px solid ${getStanceColor(chatMessages[0].stance)}`,
                    }}
                  >
                    <div className="text-[15px] leading-[20px]">
                      {chatMessages[0].message}
                    </div>
                    <div className="text-[11px] text-gray-400 text-right mt-1">
                      {chatMessages[0].time}
                    </div>
                  </div>
                  
                  {/* Reactions below message */}
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    {chatMessages[0].reactions.map((reaction, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-full px-2 py-1 flex items-center gap-1"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                        <span className="text-xs text-gray-700">{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <InputBar showBackButton onBack={() => setCurrentScreen(2)} />
          </>
        ) : (
          <>
            {/* Scenario Screen */}
            <div className="flex-1 overflow-y-auto bg-[#f0f0f5] px-6 py-8 flex flex-col">
              <div className="bg-white rounded-[24px] p-6 shadow-sm mb-6">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-4">Zukunftsszenario</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">
                  „Unser Wasser ist sauber“, protestierte Elli Lowener nun doch. „Jedenfalls sauber genug, dass wir kein Wasser aus Brasilien oder aus dem Himalaya importieren müssen. Sie plündern die letzten Naturreserven.“
                  
                  „Genau das tun wir nicht. Wir bezahlen einen nachhaltigen Preis und betreiben aktiven Naturschutz, weil die Wasserschützer strenge Kontrollen durchführen. Die Menschen in den Quellgebieten leben sehr gut davon, dass wir ihnen das Wasser abkaufen“, erwiderte Larson. Er wollte weiter ausholen und erklären, wie das Wasser durch den Menschen gequält wird. 
                  
                  Doch dann zögerte er, weil er die Wohnung nicht durch einen Streit mit der Maklerin verlieren wollte. „Liebe Frau Lowener, mir gefällt die Wohnung sehr gut. Ich möchte sie gern kaufen. Wollen wir die Einzelheiten beim Mittagessen besprechen?“, fragte er und wertete ihr Lächeln als Zustimmung. 
                  
                  „Ich möchte Sie gern einladen. In dieser Stadt gibt es das erste aquane Restaurant. Dort werden alle Speisen mit garantiert sauberem Wasser gekocht. Die haben sogar einen aquanen Wein.“
                </p>
              </div>

              {/* Chart 1: Realistisch */}
              <div className="bg-white rounded-[24px] p-4 shadow-sm mb-6">
                <div className="text-xs font-medium mb-2 text-gray-600">
                  Halten Sie es für realistisch?
                </div>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={realisticData}
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
                        {realisticData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Gefallen */}
              <div className="bg-white rounded-[24px] p-4 shadow-sm mb-6">
                <div className="text-xs font-medium mb-2 text-gray-600">
                  Würde es Ihnen gefallen?
                </div>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={likingData}
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
                        {likingData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <InputBar />
          </>
        )}
      </div>
    </div>
  );
}