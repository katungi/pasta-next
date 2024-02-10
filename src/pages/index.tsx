import { Search } from "@/components/Search";
import { TextCard } from "@/components/TextCard";
import { useClipStore } from "@/store/clips.store";
import { UnlistenFn } from "@tauri-apps/api/event";
import { CommandEmpty, CommandInput, CommandList } from "cmdk";
import _ from "lodash";
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import {
  listenToMonitorStatusUpdate,
  onClipboardUpdate,
  onFilesUpdate,
  onImageUpdate,
  onTextUpdate,
  startListening,
} from "tauri-plugin-clipboard-api";
const Home: NextPage = () => {
  const { updateClips, clips } = useClipStore()

  let unlistenTextUpdate: UnlistenFn;
  let unlistenClipboard: () => Promise<void>;
  let monitorRunning = false;

  useEffect(() => {
    const debouncedUpdateClips = _.debounce((newText) => {
      updateClips(newText);
    }, 300);
    const unlistenFunctions = async () => {
      unlistenTextUpdate = await onTextUpdate((newText) => {
        console.log("new text::");
        debouncedUpdateClips(newText);
      });
      unlistenClipboard = await startListening();
    };

    listenToMonitorStatusUpdate((running) => {
      monitorRunning = running;
    });
    unlistenFunctions().catch(console.error);

    return () => {
      if (unlistenTextUpdate) {
        unlistenTextUpdate();
      }
    };

  }, []);

  return (
    <div className="flex h-96">
      <main className="w-full overflow-auto overflow-y-auto">
        <CommandInput placeholder="Type a command or search..." />
        {/* <CommandList>
          <CommandEmpty>No Result found.</CommandEmpty>
          {
            clips.reverse().map((clip, index) => {
              return (
                <TextCard text={clip} index={index} key={index} />
              )
            }
            )
          }
        </CommandList> */}
        {
            clips.reverse().map((clip, index) => {
              return (
                <TextCard text={clip} index={index} key={index} />
              )
            }
            )
          }
      </main>
    </div>
  )
}

export default Home
