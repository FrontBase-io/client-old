import { Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import TextInput from "../../Components/Inputs/Text";
import Interactor from "../../Utils/Socket";
import styles from "./styles.module.scss";

const ScreenOnboard: React.FC = () => {
  // Vars
  const [newUser, setNewUser] = useState<{
    username?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    email?: string;
  }>({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    email: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  // Lifecycle
  // UI
  return (
    <div className={styles.center}>
      {success ? (
        <>Success. Please restart the server.</>
      ) : (
        <>
          <Typography variant="h1">
            {newUser.first_name === ""
              ? "FrontBase"
              : `Hi, ${newUser.first_name}!`}
          </Typography>
          <p>Welcome. Let's get you started!</p>
          <p>
            The first user you register will have the highest system access.
          </p>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextInput
                label="First name"
                value={newUser.first_name}
                onChange={(value) => {
                  setNewUser({ ...newUser, first_name: value as string });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                label="Last name"
                value={newUser.last_name}
                onChange={(value) => {
                  setNewUser({ ...newUser, last_name: value as string });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                label="Username"
                value={newUser.username}
                onChange={(value) => {
                  setNewUser({ ...newUser, username: value as string });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                label="password"
                password
                value={newUser.password}
                onChange={(value) => {
                  setNewUser({ ...newUser, password: value as string });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label="Email Address"
                value={newUser.email}
                onChange={(value) => {
                  setNewUser({ ...newUser, email: value as string });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  Interactor.emit(
                    "createInitialUser",
                    newUser,
                    (response: { success: boolean }) => {
                      if (response.success) setSuccess(true);
                    }
                  );
                }}
              >
                Let's go!
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default ScreenOnboard;
