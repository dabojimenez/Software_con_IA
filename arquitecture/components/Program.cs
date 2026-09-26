using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
// services.AddSingleton<XMLSave>(_ => new XMLSave("cervezas.xml"));
services.AddSingleton<JsonSave>(_ => new JsonSave("cervezas.json"));
// services.AddSingleton<ISave>(provider => provider.GetRequiredService<XMLSave>());
services.AddSingleton<ISave>(provider => provider.GetRequiredService<JsonSave>());
services.AddTransient<MyProgram>();

using var serviceProvider = services.BuildServiceProvider();
var program = serviceProvider.GetRequiredService<MyProgram>();
program.Run();
