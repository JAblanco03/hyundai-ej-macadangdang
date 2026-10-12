import Contacts
import ContactsUI
import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate, CNContactViewControllerDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = HomeViewController { [weak self] in
            self?.presentNewContact()
        }
        window.makeKeyAndVisible()
        self.window = window

        if let url = launchOptions?[.url] as? URL, isSaveContactURL(url) {
            DispatchQueue.main.async { [weak self] in
                self?.presentNewContact()
            }
        }

        return true
    }

    func application(
        _ application: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        guard isSaveContactURL(url) else { return false }
        presentNewContact()
        return true
    }

    func contactViewController(
        _ viewController: CNContactViewController,
        didCompleteWith contact: CNContact?
    ) {
        viewController.navigationController?.dismiss(animated: true)
    }

    private func isSaveContactURL(_ url: URL) -> Bool {
        url.scheme == "bydcard" && url.host == "save-contact"
    }

    private func presentNewContact() {
        guard let rootViewController = window?.rootViewController,
              rootViewController.presentedViewController == nil else {
            return
        }

        let contact = CNMutableContact()
        contact.givenName = "Erik Jourdan"
        contact.familyName = "Macadangdang"
        contact.jobTitle = "Group Retail Manager"
        contact.organizationName = "ESJAY Auto Norte Group"
        contact.phoneNumbers = [
            CNLabeledValue(
                label: CNLabelPhoneNumberMobile,
                value: CNPhoneNumber(stringValue: "+63 956 443 9474")
            )
        ]
        contact.emailAddresses = [
            CNLabeledValue(label: CNLabelWork, value: "macadangdangerik@gmail.com" as NSString)
        ]
        contact.urlAddresses = [
            CNLabeledValue(
                label: CNLabelURLAddressHomePage,
                value: "https://www.facebook.com/search/top?q=Hyundai%20Santiago%20City%20by%20Erik%20Jourdan%20Macadangdang" as NSString
            )
        ]
        contact.postalAddresses = [
            CNLabeledValue(
                label: CNLabelWork,
                value: {
                    let address = CNMutablePostalAddress()
                    address.street = "Hyundai Santiago City"
                    address.city = "Philippines"
                    return address
                }()
            )
        ]

        let contactViewController = CNContactViewController(forNewContact: contact)
        contactViewController.delegate = self
        rootViewController.present(
            UINavigationController(rootViewController: contactViewController),
            animated: true
        )
    }
}

private final class HomeViewController: UIViewController {
    private let onAddContact: () -> Void

    init(onAddContact: @escaping () -> Void) {
        self.onAddContact = onAddContact
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not supported")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground

        let titleLabel = UILabel()
        titleLabel.text = "Erik Jourdan Macadangdang"
        titleLabel.font = .preferredFont(forTextStyle: .largeTitle)
        titleLabel.textAlignment = .center

        let addButton = UIButton(type: .system)
        addButton.setTitle("Add to Contacts", for: .normal)
        addButton.titleLabel?.font = .preferredFont(forTextStyle: .headline)
        addButton.addTarget(self, action: #selector(addContactTapped), for: .touchUpInside)

        let stack = UIStackView(arrangedSubviews: [titleLabel, addButton])
        stack.axis = .vertical
        stack.spacing = 24
        stack.alignment = .center
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
    }

    @objc private func addContactTapped() {
        onAddContact()
    }
}
