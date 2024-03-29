import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import FeedIcon from "@mui/icons-material/Feed";

function Header() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
      }}
    >
      <AppBar sx={{ backgroundColor: "background.header" }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Box sx={{ flexGrow: 1, flexDirection: "column", gap: 0 }}>
              <Typography variant="h5" fontWeight="700">
                EC3's Environmental Product Declarations
              </Typography>
              <div style={{ position: "relative" }}>
                <Link
                  underline="none"
                  href="https://buildingtransparency.org/ec3"
                >
                  <LinkIcon
                    sx={{
                      color: "white",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ paddingLeft: 1, color: "white" }}
                  >
                    from Building Transparency
                  </Typography>
                </Link>
              </div>
            </Box>
            <Link
              href="https://github.com/m-clare/epd-map"
              underline="none"
              style={{ display: "inline-block" }}
            >
              <div style={{ position: "relative", paddingRight: 12 }}>
                <GitHubIcon
                  sx={{
                    color: "white",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </Link>
            <Link
              href="https://mclare.dev"
              underline="none"
              style={{ display: "inline-block" }}
            >
              <div style={{ position: "relative" }}>
                <FeedIcon
                  sx={{
                    color: "white",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Header;
