package stylevariant

func Variant(region string) string {
	switch region {
	case "DE":
		return "Hallo"
	case "FR":
		return "Bonjour"
	default:
		return "Hello"
	}
}
