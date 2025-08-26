using System;
using System.Windows.Automation;

namespace UnifiedMandala.Tools.Windows
{
    /// <summary>
    /// Lists the UI Automation tree for a given window title.
    /// </summary>
    public static class WinUITreeInspector
    {
        private static void PrintElement(AutomationElement element, int indent)
        {
            string prefix = new string(' ', indent);
            Console.WriteLine($"{prefix}{element.Current.ControlType.ProgrammaticName}:{element.Current.Name}");

            var walker = TreeWalker.ControlViewWalker;
            var child = walker.GetFirstChild(element);
            while (child != null)
            {
                PrintElement(child, indent + 2);
                child = walker.GetNextSibling(child);
            }
        }

        public static void Main(string[] args)
        {
            AutomationElement root;
            if (args.Length == 0)
            {
                root = AutomationElement.RootElement;
            }
            else
            {
                var condition = new PropertyCondition(AutomationElement.NameProperty, args[0]);
                root = AutomationElement.RootElement.FindFirst(TreeScope.Children, condition);
                if (root == null)
                {
                    Console.Error.WriteLine($"Window not found: {args[0]}");
                    return;
                }
            }

            PrintElement(root, 0);
        }
    }
}
