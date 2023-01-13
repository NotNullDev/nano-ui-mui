import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import { NanoToolbar } from "../components/NanoToolbar";

const ManagementPage = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <NanoToolbar>
        <div></div>
        <div className="flex items-center gap-2">
          <Button variant="outlined" className="text-yellow-500">
            Copy token
          </Button>
          <Button variant="outlined" color="error">
            Reset token
          </Button>
        </div>
      </NanoToolbar>
    </div>
  );
};

function NewTokenInput() {
  const val = "";
  return (
    <FormControl
      sx={{
        m: 1,
        width: "25ch",
      }}
      variant="standard"
    >
      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
      <Input
        id="standard-adornment-password"
        type={"text"}
        value={val}
        onChange={(e) => toast("e")}
      />
    </FormControl>
  );
}

export default ManagementPage;
