using System;
using System.Runtime.InteropServices;
using System.Threading;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Simple daemon that registers a global hotkey (F1) and prints when it is pressed.
    /// </summary>
    public static class HotkeyDaemon
    {
        [DllImport("user32.dll")]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);

        [DllImport("user32.dll")]
        private static extern bool PeekMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax, uint wRemoveMsg);

        private const uint PM_REMOVE = 0x0001;
        private const int WM_HOTKEY = 0x0312;

        [StructLayout(LayoutKind.Sequential)]
        private struct MSG
        {
            public IntPtr hwnd;
            public uint message;
            public IntPtr wParam;
            public IntPtr lParam;
            public uint time;
            public int pt_x;
            public int pt_y;
        }

        public static void Main()
        {
            const int HOTKEY_ID = 1;
            const uint VK_F1 = 0x70;

            if (!RegisterHotKey(IntPtr.Zero, HOTKEY_ID, 0, VK_F1))
            {
                Console.WriteLine("Failed to register hotkey.");
                return;
            }

            Console.WriteLine("Hotkey daemon active. Press Ctrl+C to exit.");
            while (true)
            {
                if (PeekMessage(out var msg, IntPtr.Zero, 0, 0, PM_REMOVE) && msg.message == WM_HOTKEY)
                {
                    Console.WriteLine("F1 pressed.");
                }
                Thread.Sleep(50);
            }
        }
    }
}
