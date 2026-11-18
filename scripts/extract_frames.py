import os
import cv2

video_path = os.path.expanduser(r"~\.gemini\antigravity\brain\f0f51e9a-f2d5-49d8-9c3b-5a5c4cb9ee8a\.user_uploaded\media_1794973633192_471a10fd.mp4")
out_dir = r"c:\Users\alecs\Desktop\EMPRESAS\2 - AUZA NEURAL\1 - PROJETOS\6 - FLUXO LEAD AI\scripts\video_frames"
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error opening video")
    exit(1)

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps
print(f"FPS: {fps}, Total Frames: {total_frames}, Duration: {duration:.2f}s")

# Extract keyframes every 15 seconds
timestamps = [5, 15, 30, 45, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340]

for ts in timestamps:
    if ts >= duration:
        continue
    frame_num = int(ts * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
    ret, frame = cap.read()
    if ret:
        out_name = f"frame_{ts:03d}s.jpg"
        out_path = os.path.join(out_dir, out_name)
        cv2.imwrite(out_path, frame)
        print(f"Saved {out_name} at {ts}s")

cap.release()
print("Done extracting frames!")
