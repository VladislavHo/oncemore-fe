import { useState } from "react";

export default function VideoModalProduct() {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError("");
      } else {
        setError("Please select a video file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please select a video to upload");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("description", description);

      // Add API call here

      setIsLoading(false);
      // Reset form
      setVideoFile(null);
      setPreviewUrl("");
      setDescription("");
    } catch (err) {
      setError("Failed to upload video");
      setIsLoading(false);
    }
  };

  return (
    <div className="video-modal">
      <h2 className="video-modal__title">Upload Video Review</h2>

      <form className="video-modal__form" onSubmit={handleSubmit}>
        <div className="video-modal__upload">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="video-modal__file-input"
          />
          {previewUrl && (
            <video src={previewUrl} className="video-modal__preview" controls />
          )}
        </div>

        <textarea
          className="video-modal__description"
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="video-modal__error">{error}</p>}

        <button
          type="submit"
          className="video-modal__submit"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Review"}
        </button>
      </form>
    </div>
  );
}
