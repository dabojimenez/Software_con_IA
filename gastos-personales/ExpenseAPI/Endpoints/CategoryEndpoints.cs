using ExpenseAPI.Contracts;

using ApplicationLayer.Ports.PrimaryPort.Categories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MyExpenses.Domain.Entities;
using MyExpenses.Domain.Exceptions;

namespace ExpenseAPI.Endpoints;

public static class CategoryEndpoints
{
    public static WebApplication MapCategoryEndpoints(this WebApplication app)
    {
        app.MapPost("/categories", async Task<Results<Created<CategoryResponse>, BadRequest<ProblemDetails>>> (
            CreateCategoryRequest request,
            ICreateCategory createCategory) =>
        {
            try
            {
                var category = new Category(request.Name);
                await createCategory.CreateAsync(category);

                var response = new CategoryResponse(category.Id, category.Name);
                return TypedResults.Created($"/categories/{category.Id}", response);
            }
            catch (DomainException exception)
            {
                return TypedResults.BadRequest(new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Invalid category",
                    Detail = exception.Message
                });
            }
        })
        .WithName("CreateCategory")
        .WithSummary("Create a category")
        .WithDescription("Creates a category and returns its identifier and name.")
        .Produces<CategoryResponse>(StatusCodes.Status201Created)
        .Produces<ProblemDetails>(StatusCodes.Status400BadRequest);

        app.MapGet("/categories", async Task<Ok<IReadOnlyList<CategoryResponse>>> (
            IGetCategories getCategories) =>
        {
            var categories = await getCategories.GetAsync();
            IReadOnlyList<CategoryResponse> response = categories
                .Select(category => new CategoryResponse(category.Id, category.Name))
                .ToArray();

            return TypedResults.Ok(response);
        })
        .WithName("GetCategories")
        .WithSummary("Get all categories")
        .WithDescription("Returns all categories.")
        .Produces<IReadOnlyList<CategoryResponse>>(StatusCodes.Status200OK);

        app.MapDelete("/categories/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (
            Guid id,
            IGetCategories getCategories,
            IDeleteCategory deleteCategory) =>
        {
            var category = (await getCategories.GetAsync())
                .FirstOrDefault(item => item.Id == id);

            if (category is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Category not found",
                    Detail = $"Category '{id}' was not found."
                });
            }

            await deleteCategory.DeleteAsync(category);
            return TypedResults.NoContent();
        })
        .WithName("DeleteCategory")
        .WithSummary("Delete a category")
        .WithDescription("Deletes a category by its identifier.")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ProblemDetails>(StatusCodes.Status404NotFound);

        return app;
    }
}
