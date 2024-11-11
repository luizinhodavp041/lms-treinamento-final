import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
  onNextLecture,
  onWatchAgain,
  isLastLecture = false,
  showControls: initialShowControls = true,
  preventAutoPlay = false,
}) {
  const [playing, setPlaying] = useState(!preventAutoPlay);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(initialShowControls);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const maxProgressRef = useRef(0);

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      if (state.played > maxProgressRef.current && !seeking) {
        maxProgressRef.current = state.played;
      }

      if (state.played <= maxProgressRef.current) {
        setPlayed(state.played);
      } else {
        playerRef.current?.seekTo(maxProgressRef.current);
      }

      if (state.played >= 0.99) {
        setPlaying(false);
        if (!isLastLecture && onNextLecture) {
          setShowCompletionDialog(true);
        }
        onProgressUpdate?.({
          ...progressData,
          progressValue: 1,
        });
      }
    }
  }

  function handleRewind() {
    const newTime = Math.max(0, playerRef.current.getCurrentTime() - 5);
    playerRef.current?.seekTo(newTime);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function handleNextClick() {
    setShowCompletionDialog(false);
    onNextLecture?.();
  }

  function handleWatchAgainClick() {
    setShowCompletionDialog(false);
    maxProgressRef.current = 0;
    setPlayed(0);
    playerRef.current?.seekTo(0);
    setPlaying(true);
    onWatchAgain?.();
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    if (initialShowControls) {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000
      );
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate?.({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <>
      <div
        ref={playerContainerRef}
        className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
        ${isFullScreen ? "w-screen h-screen" : ""}
        `}
        style={{ width, height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => initialShowControls && setShowControls(false)}
      >
        <ReactPlayer
          ref={playerRef}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          progressInterval={500}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                onContextMenu: (e) => e.preventDefault(),
              },
            },
          }}
        />
        {showControls && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-full h-1 bg-gray-600 rounded mb-4">
              <div
                className="h-full bg-white rounded transition-all duration-200"
                style={{ width: `${played * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayAndPause}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                >
                  {playing ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button
                  onClick={handleRewind}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
                <Button
                  onClick={handleToggleMute}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                >
                  {muted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleVolumeChange([value[0] / 100])
                  }
                  className="w-24"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-white">
                  {formatTime(
                    played * (playerRef?.current?.getDuration() || 0)
                  )}{" "}
                  / {formatTime(playerRef?.current?.getDuration() || 0)}
                </div>
                <Button
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                  onClick={handleFullScreen}
                >
                  {isFullScreen ? (
                    <Minimize className="h-6 w-6" />
                  ) : (
                    <Maximize className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isLastLecture && onNextLecture && (
        <Dialog
          open={showCompletionDialog}
          onOpenChange={setShowCompletionDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Aula concluída!</DialogTitle>
              <DialogDescription>
                O que você deseja fazer agora?
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Button
                onClick={handleNextClick}
                className="w-full"
                variant="default"
              >
                Próxima aula
              </Button>
              <Button
                onClick={handleWatchAgainClick}
                className="w-full"
                variant="outline"
              >
                Assistir novamente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default VideoPlayer;
