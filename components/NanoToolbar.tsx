import { Paper } from "@mui/material";

export type NanoToolbarType = {
  children: React.ReactNode;
};

export const NanoToolbar = ({ children }: NanoToolbarType) => {
  return (
    <Paper className="w-4/5 mx-auto h-20 mb-12 flex justify-between px-4">
      {children}
    </Paper>
  );
};
