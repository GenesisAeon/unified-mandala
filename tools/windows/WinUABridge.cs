using System;
using System.Windows.Automation;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Minimal bridge to the Windows UI Automation API.
    /// Enumerates top level windows and prints their names.
    /// </summary>
    public static class WinUABridge
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Active windows:");
            AutomationElement root = AutomationElement.RootElement;
            var condition = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window);
            var walker = new TreeWalker(condition);
            var current = walker.GetFirstChild(root);
            while (current != null)
            {
                Console.WriteLine(current.Current.Name);
                current = walker.GetNextSibling(current);
            }
        }
    }
}
