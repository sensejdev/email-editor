import { Bold, Eraser, Italic, Underline } from "lucide-react";
import styles from "./EmailEditor.module.scss";

import parse from "html-react-parser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailService } from "../../services/email.service";
import { useEditor } from "./useEditor";

export function EmailEditor() {
  const { text, applyFormat, updateSelection, setText, textRef } = useEditor();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create email"],
    mutationFn: () => emailService.sendEmail(text),
    onSuccess() {
      setText("");
      queryClient.refetchQueries({ queryKey: ["email list"] });
    },
  });

  return (
    <div>
      <h1>Email editor</h1>
      {text && <div className={styles.preview}>{parse(text)}</div>}
      <div className={styles.card}>
        <textarea
          ref={textRef}
          className={styles.editor}
          onSelect={updateSelection}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className={styles.actions}>
          <div className={styles.tools}>
            <button onClick={() => setText("")}>
              <Eraser size={16} />
            </button>
            <button onClick={() => applyFormat("bold")}>
              <Bold size={16} />
            </button>
            <button onClick={() => applyFormat("italic")}>
              <Italic size={16} />
            </button>
            <button onClick={() => applyFormat("underline")}>
              <Underline size={16} />
            </button>
          </div>
          <button disabled={isPending || !text} onClick={() => mutate()}>
            Send now
          </button>
        </div>
      </div>
    </div>
  );
}
