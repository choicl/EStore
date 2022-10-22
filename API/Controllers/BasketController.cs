using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly StoreContext _context;

    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket(GetBuyerId());
        
        if (basket == null) return NotFound();

        return MapBasketToDto(basket);
    }

    [HttpPost] // api/basket?productId=3&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        //get basket || create basket
        var basket = await RetrieveBasket(GetBuyerId());
        if (basket == null) basket = CreateBasket();
        //get product
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();
        //add item
        basket.AddItem(product, quantity);
        //check if any changes were made and save them 
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
        return BadRequest(new ProblemDetails{ Title = "Problem saving item to basket"});
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
    {
        //get basket
        var basket = await RetrieveBasket(GetBuyerId());
        if (basket == null) return NotFound();
        //remove item or reduce quantity
        basket.RemoveItem(productId, quantity);
        //save changes
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok();
        return BadRequest(new ProblemDetails{ Title = "Problem removing item from basket"});
    }

    #region Private Helper Methods
    
    //TODO:Solve CS1061 Error 
    private async Task<Basket> RetrieveBasket(string buyerId)
    {
        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }

        return await _context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }
    
    private Basket CreateBasket()
    {
        var buyerId = User.Identity?.Name;
        if (string.IsNullOrEmpty(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        }
        var basket = new Basket { BuyerId = buyerId };
        _context.Baskets.Add(basket);
        return basket;
    }
    private BasketDto MapBasketToDto(Basket basket)
    {
        return new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                PictureUrl = item.Product.PictureUrl,
                Type = item.Product.Type,
                Brand = item.Product.Brand,
                Quantity = item.Quantity
            }).ToList()
        };
    }
    private string GetBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }
    #endregion
}