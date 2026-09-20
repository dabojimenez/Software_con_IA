class SMSNotification
{
    public void SendSMS(string message)
    {
        System.Console.WriteLine("Sendig SMS: " + message);
    }
}

class Sale
{
    SMSNotification sMSNotification = new SMSNotification();

    public void Create()
    {
        System.Console.WriteLine("Venta creada");
        sMSNotification("Tu venta fue creada exitosamente");
    }
}

class Report
{
    // SMSNotification sMSNotification = new SMSNotification();
    // EmailNotification emailNotification = new EmailNotification();
    PushNotification notification = new PushNotification("codnig uno");
    
    public void Generate()
    {
        System.Console.WriteLine("Reporte generado");

        // sMSNotification.SendSMS("Tu reporte ha sido generado exitosamente");
        // emailNotification.SendEmail("Tu reporte ha sido generado exitosamente");
        notification.SendPush("Tu reporte ha sido generado exitosamente");
    }
}

class EmailNotification
{
    public void SendEmail(string message)
    {
        System.Console.WriteLine("Sending sms: " + message);
    }
}

class PushNotification
{
    private string _config;
    public WithoutStrategy(string config)
    {
        _config = config;
    }
    public void SendPush(string message)
    {
        System.Console.WriteLine("Sending push notification: " + message);
    }
}