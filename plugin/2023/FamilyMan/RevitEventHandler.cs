using System.Diagnostics;
using Autodesk.Revit.UI;


namespace FamilyMan
{
    public class RevitEventHandler : IExternalEventHandler
    {
        public enum RevitActionsEnum
        {
            Invalid = -1,
            Loaded
        }

        private RevitActionsEnum _currentRevitActions;
        private readonly ExternalEvent _externalEvent;
        public SendWindow sendWindow;
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
                case RevitActionsEnum.Loaded:
                    string payload = Converter.Mesher.CreatePayload(app);
                    Debug.WriteLine(sendWindow);
                    if (sendWindow == null) { return; };
                    sendWindow.SendPayload(payload);
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
