#region Namespaces
using System;
using System.Collections.Generic;
using System.Diagnostics;
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.UI.Selection;
#endregion

namespace FamilyMan
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    public class Command : IExternalCommand
    {
        public Result Execute(
          ExternalCommandData commandData,
          ref string message,
          ElementSet elements)
        {
            try
            {
                FamWindow famWindow = new FamWindow(commandData.Application);
                App.rvtHandler.famWindow = famWindow;
                famWindow.Show();
                return Result.Succeeded;
            }
            catch (Exception ex) {
                Debug.WriteLine(ex.Message);
                return Result.Failed;
            }
        }
    }
}
