using System;
using System.Speech.Recognition;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Streams speech recognition results from the default microphone.
    /// </summary>
    public static class SpeechListener
    {
        public static void Main()
        {
            using var recognizer = new SpeechRecognitionEngine();
            recognizer.SetInputToDefaultAudioDevice();
            recognizer.LoadGrammar(new DictationGrammar());
            recognizer.SpeechRecognized += (_, e) => Console.WriteLine($"Recognized: {e.Result.Text}");
            Console.WriteLine("Listening... press Enter to stop.");
            recognizer.RecognizeAsync(RecognizeMode.Multiple);
            Console.ReadLine();
        }
    }
}
