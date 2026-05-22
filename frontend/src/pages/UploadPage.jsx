import UploadBox from "../components/uploads/UploadBox";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <UploadBox />
      </div>
    </div>
  );
};

export default UploadPage;
