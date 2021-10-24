import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useDropzone } from "react-dropzone";
import { serverUrl } from "../../../Utils/Socket";

const ImageInput: React.FC<{
  label?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  password?: true;
  disabled?: true | boolean;
  mode?: "text" | "textarea";
  autoFocus?: boolean;
  objectId: string;
}> = ({ label, value, onChange, disabled, objectId }) => {
  // Vars
  const [files, setFiles] = useState<any[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    disabled: disabled,
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("objectId", objectId);
      formData.append("username", localStorage.getItem("username")!);
      formData.append("token", localStorage.getItem("token")!);

      fetch(`${serverUrl}/upload`, {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        const r = await response.json();
        r.status && onChange && onChange(r.data.path);
      });

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 2,
        border: "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: "border-box",
      }}
      key={file.name}
    >
      <div
        style={{
          display: "flex",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={file.preview}
          style={{
            display: "block",
            width: "auto",
            height: "100%",
          }}
          alt="Uploaded"
        />
      </div>
    </div>
  ));

  // Lifecycle
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // UI
  return (
    <label>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 16,
          }}
        >
          {thumbs}
        </aside>
      </section>
    </label>
  );
};

export default ImageInput;
