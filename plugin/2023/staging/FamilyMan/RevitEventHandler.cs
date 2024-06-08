using System.Diagnostics;
using Autodesk.Revit.UI;


namespace FamilyMan
{
    public class RevitEventHandler : IExternalEventHandler
    {
        public enum RevitActionsEnum
        {
            Invalid = -1,
            Loaded,
            getFamilies_Sort_Category,
            getFamilies_Of_Category
        }

        private RevitActionsEnum _currentRevitActions;
        private readonly ExternalEvent _externalEvent;
        public FamWindow famWindow;
        //public 

        public RevitEventHandler()
        {
            _externalEvent = ExternalEvent.Create(this);
        }

        public void Execute(UIApplication app)
        {
            Debug.WriteLine("Handling!");
            switch (_currentRevitActions)
            {
                case RevitActionsEnum.getFamilies_Sort_Category:
                    string family_json = Actions.Finder.getFamilySymbols_Sort_Category(app);
                    famWindow.SendPayload("load-families", family_json);
                    break;
                case RevitActionsEnum.getFamilies_Of_Category:
                    break;
                default:
                    Debug.WriteLine("RevitEventHandler action not defined");
                    break;
            }
            return;
        }

        public ExternalEventRequest Raise(RevitActionsEnum revitActionsName)
        {
            _currentRevitActions = revitActionsName;
            return _externalEvent.Raise();
        }

        public string GetName()
        {
            return nameof(RevitEventHandler);
        }
    }
}
