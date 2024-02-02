using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private readonly AzureTableStorageService _tableStorageService;

    public EventController(AzureTableStorageService tableStorageService)
    {
        _tableStorageService = tableStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> Get()
    {
        var events = await _tableStorageService.GetAllEventsAsync();
        return Ok(events);
    }

    // Add HTTP methods for POST, PUT, DELETE, etc.
}
