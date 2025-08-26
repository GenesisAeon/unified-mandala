using System;
using System.Drawing;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Simple utility that redacts regions in a screenshot by overlaying black rectangles.
    /// </summary>
    public static class UIARedactor
    {
        /// <summary>
        /// Masks the specified regions of an image.
        /// Usage: UIARedactor <inputPath> <outputPath> [x y width height]...
        /// </summary>
        public static void Main(string[] args)
        {
            if (args.Length < 2 || ((args.Length - 2) % 4) != 0)
            {
                Console.WriteLine("Usage: UIARedactor <inputPath> <outputPath> [x y width height]...");
                return;
            }

            var inputPath = args[0];
            var outputPath = args[1];
            using var image = (Bitmap)Image.FromFile(inputPath);
            using var g = Graphics.FromImage(image);

            for (int i = 2; i < args.Length; i += 4)
            {
                int x = int.Parse(args[i]);
                int y = int.Parse(args[i + 1]);
                int w = int.Parse(args[i + 2]);
                int h = int.Parse(args[i + 3]);
                g.FillRectangle(Brushes.Black, x, y, w, h);
            }

            image.Save(outputPath);
        }
    }
}
