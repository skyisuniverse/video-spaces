// 'use client';

// import { Box, Typography } from '@mui/material';
// import { StatusChip } from './StatusChip';
// import { useNavigation } from '@/app/[lang]/contexts/navigation-context';

// export const ADRHeader = () => {
//   const { currentAdr, decisionDict } = useNavigation();

//   // Safety guard (in case you're on a list page, not a detail page)
//   if (!currentAdr) {
//     return null;
//   }

//   return (
//     <Box sx={{ mb: 4 }}>
//       {/* Title on its own line */}
//       <Typography variant="h4" component="h1" gutterBottom>
//         {currentAdr.title}
//       </Typography>

//       {/* Status + Date on a separate line, side by side */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//         <StatusChip 
//           status={currentAdr.status} 
//           dict={decisionDict}
//         />
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{ fontWeight: 500 }}
//         >
//           {currentAdr.date}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };