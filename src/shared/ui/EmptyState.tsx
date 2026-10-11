import { Box, Button, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box role="status" sx={{ py: 6, px: 2, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
      <InboxOutlinedIcon sx={{ fontSize: 38, color: "text.secondary", mb: 1 }} />
      <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
      {description && <Typography color="text.secondary" sx={{ mb: actionLabel ? 2 : 0 }}>{description}</Typography>}
      {actionLabel && onAction && <Button onClick={onAction} variant="outlined">{actionLabel}</Button>}
    </Box>
  );
}
