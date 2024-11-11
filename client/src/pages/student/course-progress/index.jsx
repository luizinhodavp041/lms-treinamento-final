import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
        return;
      }

      setStudentCurrentCourseProgress({
        courseDetails: response?.data?.courseDetails,
        progress: response?.data?.progress,
      });

      if (response?.data?.completed) {
        setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
        return;
      }

      const lastViewedIndex = response?.data?.progress?.reduceRight(
        (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
        -1
      );

      const nextLectureIndex = lastViewedIndex === -1 ? 0 : lastViewedIndex + 1;
      setCurrentLecture(
        response?.data?.courseDetails?.curriculum[nextLectureIndex]
      );
    }
  }

  async function updateCourseProgress(lectureId) {
    try {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        lectureId
      );

      if (response?.success) {
        setStudentCurrentCourseProgress((prev) => ({
          ...prev,
          progress: prev.progress.map((p) =>
            p.lectureId === lectureId ? { ...p, viewed: true } : p
          ),
        }));

        const updatedProgress = studentCurrentCourseProgress.progress.map((p) =>
          p.lectureId === lectureId ? { ...p, viewed: true } : p
        );

        const allLecturesCompleted =
          studentCurrentCourseProgress?.courseDetails?.curriculum.every(
            (lecture) =>
              updatedProgress.some(
                (p) => p.lectureId === lecture._id && p.viewed
              )
          );

        if (allLecturesCompleted) {
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating course progress:", error);
      return false;
    }
  }

  const handleNextLecture = async (currentLectureId) => {
    try {
      const updated = await updateCourseProgress(currentLectureId);

      if (updated) {
        const currentIndex =
          studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
            (item) => item._id === currentLectureId
          );

        if (
          currentIndex <
          studentCurrentCourseProgress?.courseDetails?.curriculum.length - 1
        ) {
          const nextLecture =
            studentCurrentCourseProgress?.courseDetails?.curriculum[
              currentIndex + 1
            ];
          setCurrentLecture(nextLecture);
        } else {
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
        }
      }
    } catch (error) {
      console.error("Error handling next lecture:", error);
    }
  };

  const handleWatchAgain = () => {
    setCurrentLecture((prev) => ({
      ...prev,
      progressValue: 0,
    }));
  };

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      await fetchCurrentCourseProgress();
    }
  }

  const handleLectureChange = (lecture) => {
    setCurrentLecture(lecture);
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 15000);
    }
  }, [showConfetti]);

  const isLectureCompleted = (lectureId) => {
    return studentCurrentCourseProgress?.progress?.some(
      (p) => p.lectureId === lectureId && p.viewed
    );
  };

  if (lockCourse) {
    return (
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => navigate("/student-courses")}>Go Back</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-black"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar aos meus cursos
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={(progress) => {
              setCurrentLecture((prev) => ({
                ...prev,
                progressValue: progress,
              }));
            }}
            progressData={currentLecture}
            onNextLecture={() => handleNextLecture(currentLecture?._id)}
            onWatchAgain={handleWatchAgain}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className="text-black rounded-none h-full"
              >
                Conteúdo do curso
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-black rounded-none h-full"
              >
                Visão geral
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className={`flex items-center space-x-2 text-sm text-white font-bold cursor-pointer hover:bg-gray-800 p-2 rounded ${
                          currentLecture?._id === item._id ? "bg-gray-700" : ""
                        }`}
                        key={item._id}
                        onClick={() => handleLectureChange(item)}
                      >
                        {isLectureCompleted(item._id) ? (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">Sobre o curso</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Parabéns!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>Você concluiu o curso</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  Meus cursos
                </Button>
                <Button onClick={handleRewatchCourse}>
                  Assistir novamente
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
