using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cryptography;

namespace Asp.NetCoreWebAPI
{
    public class JwtTokenGenerator
    {
        private readonly string _secretKey;

        public JwtTokenGenerator(string secretKey)
        {
            _secretKey = secretKey; // Use the stored key
        }

        private static string GenerateLongKey(string secretKey)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var bytes = new byte[32]; // 256 bits
                rng.GetBytes(bytes);
                return Convert.ToBase64String(bytes);
            }
        }

        public string GenerateToken(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                throw new ArgumentException("Username cannot be null or empty", nameof(username));
            }

            try
            {
                var token = new JwtSecurityToken(
                    issuer: "your_issuer",
                    audience: "your_audience",
                    claims: new[]
                    {
                        new Claim(ClaimTypes.Name, username)
                    },
                    expires: DateTime.UtcNow.AddMinutes(30),
                    signingCredentials: new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                        SecurityAlgorithms.HmacSha256)
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                // Log the exception and return an error message
                throw new Exception("Failed to generate token", ex);
            }
        }
    }
}