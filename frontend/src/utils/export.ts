export const exportCanvasToImage = (canvas: HTMLCanvasElement | null, fileName: string) => {
  if (!canvas) return;

  // For a production-ready export, we might want to create a temporary off-screen canvas 
  // to draw only the elements with a proper background, instead of just grabbing the current viewport.
  // But for now, toDataURL is a great start.
  
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName.replace(/\s+/g, "_").toLowerCase() || "slate"}_export.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Failed to export image:", err);
    alert("Could not export image. This can happen if the board contains external images.");
  }
};
