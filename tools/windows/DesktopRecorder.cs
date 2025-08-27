using System;
using System.Diagnostics;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Simple desktop recorder that invokes ffmpeg to capture screen and audio.
    /// Requires environment variable MANDALA_DESKTOP_RECORD_CONSENT=yes to run.
    /// </summary>
    public static class DesktopRecorder
    {
        public static int Main(string[] args)
        {
            var consent = Environment.GetEnvironmentVariable("MANDALA_DESKTOP_RECORD_CONSENT");
            if (!string.Equals(consent, "yes", StringComparison.OrdinalIgnoreCase))
            {
                Console.Error.WriteLine("Consent not granted. Set MANDALA_DESKTOP_RECORD_CONSENT=yes to enable recording.");
                return 1;
            }

            var output = args.Length > 0 ? args[0] : "recording.mp4";
            var ffmpeg = args.Length > 1 ? args[1] : "ffmpeg";

            var ffArgs = $"-y -f gdigrab -i desktop -f dshow -i audio=\"virtual-audio-capturer\" \"{output}\"";
            var proc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = ffmpeg,
                    Arguments = ffArgs,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                }
            };

            proc.OutputDataReceived += (_, e) => { if (e.Data != null) Console.WriteLine(e.Data); };
            proc.ErrorDataReceived += (_, e) => { if (e.Data != null) Console.Error.WriteLine(e.Data); };

            proc.Start();
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();
            proc.WaitForExit();

            Console.WriteLine($"Saved recording to {output}");
            return proc.ExitCode;
        }
    }
}
