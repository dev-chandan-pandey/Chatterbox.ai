// // import React from "react";
// import { Box, Avatar, Typography } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// function extractCodeFromString(message: string) {
//   if (message.includes("```")) {
//     const blocks = message.split("```");
//     return blocks;
//   }
// }

// function isCodeBlock(str: string) {
//   if (
//     str.includes("=") ||
//     str.includes(";") ||
//     str.includes("[") ||
//     str.includes("]") ||
//     str.includes("{") ||
//     str.includes("}") ||
//     str.includes("#") ||
//     str.includes("//")
//   ) {
//     return true;
//   }
//   return false;
// }
// const ChatItem = ({
//   content,
//   role,
// }: {
//   content: string;
//   role: "user" | "assistant";
// }) => {
//   const messageBlocks = extractCodeFromString(content);
//   const auth = useAuth();
//   return role == "assistant" ? (
//     <Box
//       sx={{
//         display: "flex",
//         p: 2,
//         bgcolor: "#004d5612",
//         gap: 2,
//         borderRadius: 2,
//         my: 1,
//       }}
//     >
//       <Avatar sx={{ ml: "0" }}>
//         <img src="openai.png" alt="openai" width={"30px"} />
//       </Avatar>
//       <Box>
//         {!messageBlocks && (
//           <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
//         )}
//         {messageBlocks &&
//           messageBlocks.length &&
//           messageBlocks.map((block) =>
//             isCodeBlock(block) ? (
//               <SyntaxHighlighter style={coldarkDark} language="javascript">
//                 {block}
//               </SyntaxHighlighter>
//             ) : (
//               <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
//             )
//           )}
//       </Box>
//     </Box>
//   ) : (
//     <Box
//       sx={{
//         display: "flex",
//         p: 2,
//         bgcolor: "#004d56",
//         gap: 2,
//         borderRadius: 2,
//       }}
//     >
//       <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
//         {auth?.user?.name[0]}
//         {auth?.user?.name.split(" ")[1][0]}
//       </Avatar>
//       <Box>
//         {!messageBlocks && (
//           <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
//         )}
//         {messageBlocks &&
//           messageBlocks.length &&
//           messageBlocks.map((block) =>
//             isCodeBlock(block) ? (
//               <SyntaxHighlighter style={coldarkDark} language="javascript">
//                 {block}
//               </SyntaxHighlighter>
//             ) : (
//               <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
//             )
//           )}
//       </Box>
//     </Box>
//   );
// };

// export default ChatItem;
import { Box, Typography, Avatar } from "@mui/material";

type Props = {
  role?: "user" | "assistant";
  content?: string;
};

const ChatItem = ({ role, content }: Props) => {
  if (!content || !role) return null; // ✅ HARD SAFETY

  const isUser = role === "user";

  const initials = isUser ? "U" : "AI";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      {!isUser && <Avatar sx={{ mr: 1 }}>{initials}</Avatar>}

      <Box
        sx={{
          bgcolor: isUser ? "#00fffc" : "rgb(17,29,39)",
          color: isUser ? "black" : "white",
          px: 2,
          py: 1,
          borderRadius: 2,
          maxWidth: "70%",
        }}
      >
        <Typography>{content}</Typography>
      </Box>

      {isUser && <Avatar sx={{ ml: 1 }}>{initials}</Avatar>}
    </Box>
  );
};

export default ChatItem;
