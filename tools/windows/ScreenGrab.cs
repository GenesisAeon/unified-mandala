using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Captures the primary screen and saves it to the given file.
    /// </summary>
    public static class ScreenGrab
    {
        public static void Main(string[] args)
        {
            var output = args.Length > 0 ? args[0] : "screenshot.png";
            var bounds = Screen.PrimaryScreen.Bounds;
            using var bmp = new Bitmap(bounds.Width, bounds.Height);
            using var g = Graphics.FromImage(bmp);
            g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size);
            bmp.Save(output, ImageFormat.Png);
            Console.WriteLine($"Saved screenshot to {output}");
        }
    }
}
