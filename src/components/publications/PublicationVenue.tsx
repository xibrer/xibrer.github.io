import { Publication } from '@/types/publication';

interface PublicationVenueProps {
    publication: Publication;
}

function getVenueDisplay(publication: Publication): { abbreviation?: string; fullName: string } {
    const venue = publication.journal || publication.conference || '';

    if (venue.includes('Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies')) {
        return {
            abbreviation: `UbiComp ${publication.year}`,
            fullName: venue,
        };
    }

    if (/INFOCOM|IEEE Conference on Computer Communications/i.test(venue)) {
        return {
            abbreviation: `INFOCOM ${publication.year}`,
            fullName: venue.replace(/^IEEE INFOCOM \d{4}\s*-\s*/i, ''),
        };
    }

    return {
        fullName: venue ? `${venue} ${publication.year}` : String(publication.year),
    };
}

export default function PublicationVenue({ publication }: PublicationVenueProps) {
    const { abbreviation, fullName } = getVenueDisplay(publication);

    return (
        <>
            {abbreviation && (
                <>
                    <strong className="text-red-600 dark:text-red-400">{abbreviation}</strong>
                    <span aria-hidden="true"> · </span>
                </>
            )}
            <span>{fullName}</span>
        </>
    );
}
