import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Button, Grid, Typography } from "@material-ui/core";
import TextInput from "../../Components/Inputs/Text";
import Socket from "../../Utils/Socket";
import { ResponseType } from "../../Utils/Types";

const ScreenLogIn: React.FC = () => {
  // Vars
  const [up, setUp] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  // Lifecycle
  // UI
  return (
    <div className={styles.center}>
      <Typography variant="h1">Log in</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            label="Username"
            value={up.username}
            onChange={(value) => {
              setUp({ ...up, username: value as string });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            label="Password"
            password
            value={up.password}
            onChange={(value) => {
              setUp({ ...up, password: value as string });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setLoading(true);
              Socket.emit("getToken", up, (response: ResponseType) => {
                if (response.success) {
                  // Save the username and token for future logging in
                  localStorage.setItem("username", up.username);
                  localStorage.setItem("token", response.token);

                  // Now attempt a token based login
                  Socket.emit(
                    "logIn",
                    { username: up.username, token: response.token },
                    (response: ResponseType) => {
                      console.log(response);
                    }
                  );
                } else {
                  console.log(response);
                }
              });
            }}
            disabled={loading}
          >
            Sign in
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ScreenLogIn;
