using JobPortal.API.Data;
using JobPortal.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class JobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JobsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/jobs
    [HttpGet]
    public async Task<IActionResult> GetAllJobs()
    {
        var jobs = await _context.Jobs.ToListAsync();
        return Ok(jobs);
    }

    // GET: api/jobs/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobById(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return NotFound();

        return Ok(job);
    }

    // POST: api/jobs
    [HttpPost]
    public async Task<IActionResult> CreateJob(Job job)
    {
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetJobById),
            new { id = job.Id },
            job);
    }

    // PUT: api/jobs/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(int id, Job updatedJob)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return NotFound();

        job.Title = updatedJob.Title;
        job.Company = updatedJob.Company;
        job.Location = updatedJob.Location;
        job.Salary = updatedJob.Salary;

        await _context.SaveChangesAsync();

        return Ok(job);
    }

    // DELETE: api/jobs/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return NotFound();

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}