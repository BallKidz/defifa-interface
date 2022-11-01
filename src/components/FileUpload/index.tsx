import Dropzone from "react-dropzone";
import styles from "./FileUpload.module.css";

const FileUpload = () => {
  return (
    <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()} className={styles.fileUpload}>
            <input {...getInputProps()} />
            <p>UPLOAD TIER IMAGE</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default FileUpload;
