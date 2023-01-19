import { Paper } from "@mui/material";

export type NanoToolbarType = {
  children: React.ReactNode;
  className?: string;
};

export const NanoToolbar = ({ children, className }: NanoToolbarType) => {
  return (
    <Paper
      className={
        "mx-auto container gap-4 p-5 justify-center  mb-12 flex max-w-[90vw] flex-wrap  whitespace-nowrap " +
          className ?? ""
      }
    >
      {children}
    </Paper>
  );
};
