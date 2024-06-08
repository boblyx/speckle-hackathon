#region Namespaces
using System;
using System.Collections.Generic;
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System.IO;
using System.Reflection;
using System.Drawing;
using System.Drawing.Imaging;
#endregion

namespace FamilyMan
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    class App : IExternalApplication
    {
        public static RevitEventHandler rvtHandler;
        public Result OnStartup(UIControlledApplication a)
        {
            a.CreateRibbonTab("FamilyMan");
            RibbonPanel FM_Ribbon = a.CreateRibbonPanel("FamilyMan", "Change Request");
            rvtHandler = new RevitEventHandler();

            string thisAssembly = Assembly.GetExecutingAssembly().Location;
            PushButtonData showPanel = new PushButtonData("Change UI", "Cange UI", thisAssembly, "FamilyMan.Command");
            RibbonItem show = FM_Ribbon.AddItem(showPanel);
            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication a)
        {
            return Result.Succeeded;
        }
    }
}
